const fs = require('fs')
const Database = require('./Database')
const Mail = require('./Mail')
const JsonWebToken = require('./JsonWebToken')
const {
  hash,
  random,
  isEmpty,
  userGetAgeFromDate,
} = require('../utils')
const { POPULARITY_POINTS } = require('../config/constants').MATCHING_SYSTEM
const { BOUNDARY_VALUES } = require('../config/constants')

class User {
  constructor() {
    this.jwt = new JsonWebToken()
    this.database = new Database()
    this.mail = new Mail()
    this.user = {
      id: null,
      username: null,
      lastname: null,
      firstname: null,
      fullname: null,
      email: null,
      age: null,
      birthday: null,
      creation: null,
      gender: null,
      orientation: [],
      popularity: 0,
      biography: null,
      latitude: null,
      longitude: null,
      isGeolocalised: false,
      interests: [],
      token: null,
      pictures: [],
      profilePic: null,
      likes: [],
      liked: [],
      identificationToken: null,
      registrationToken: null,
      isAccountConfirmed: false,
      isAccountComplete: false,
    }
  }

  add(user, redirectUri) {
    return new Promise((resolve, reject) => (
      this.database.query(
        'SELECT COUNT(*) AS count FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;',
        [user.username, user.email]
      )
        .then((rows) => {
          if (rows[0].count > 0) throw new Error('An account with entered email/username already exists')
          const salt = random(255)
          const password = hash(user.password, salt)
          this.user.username = user.username
          this.user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)
          this.user.lastname = user.lastname.toUpperCase()
          this.user.fullname = this.user.firstname.concat(' ', this.user.lastname)
          this.user.email = user.email
          return (this.database.query(
            'INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`, `password`, `salt`) VALUES (?, ?, ?, ?, ?, ?);',
            [
              this.user.username,
              this.user.firstname,
              this.user.lastname,
              this.user.email,
              password,
              salt,
            ]
          ))
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          this.user.id = rows.insertId
          this.user.registrationToken = random(255)
          return (this.database.query(
            'INSERT INTO `users_registration` (`token`, `user_id`, `expiration_date`) VALUES (?, ?, NOW() + INTERVAL 1 DAY);',
            [
              this.user.registrationToken,
              this.user.id,
            ]
          ))
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.mail.registration(this.user, redirectUri)
        })
        .then(() => this.addIdentificationToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  addBlock(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query('INSERT INTO `users_blocked` (`blocker_id`, `blocked_id`) VALUES (?, ?);', [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.database.query(
            'UPDATE `users` SET `users`.`popularity` = '
            + 'IF (`users`.`popularity` - ? <= ?, ?, `users`.`popularity` - ?) '
            + 'WHERE `users`.`id` = ?;',
            [
              POPULARITY_POINTS.BLOCK,
              BOUNDARY_VALUES.POPULARITY_MIN,
              BOUNDARY_VALUES.POPULARITY_MIN,
              POPULARITY_POINTS.BLOCK,
              receiverId,
            ]
          )
        })
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  addIdentificationToken() {
    return new Promise((resolve, reject) => {
      const user = Object.assign(this.user, { date: Date.now() })
      return this.jwt.create(user)
        .then((newToken) => {
          if (isEmpty(newToken)) throw new Error('Cannot create new token.')
          this.user.identificationToken = newToken
          return resolve(this.user)
        })
        .catch(err => reject(err))
    })
  }

  addLike(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query('INSERT INTO `users_likes` (`liker_id`, `liked_id`) VALUES (?, ?);', [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.database.query(
            'UPDATE `users` SET `users`.`popularity` = '
            + 'IF (`users`.`popularity` + ? >= ?, ?, `users`.`popularity` + ?) '
            + 'WHERE `users`.`id` = ?;',
            [
              POPULARITY_POINTS.LIKE,
              BOUNDARY_VALUES.POPULARITY_MAX,
              BOUNDARY_VALUES.POPULARITY_MAX,
              POPULARITY_POINTS.LIKE,
              receiverId,
            ]
          )
        })
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  addPicture(file, userId) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => {
          if (this.user.pictures.length >= 5) throw new Error('Maximum number of pictures reached.')
          const isProfilePicture = (this.user.pictures.length === 0)
          return this.database.query(
            'INSERT INTO `users_pictures` (`user_id`, `filename`, `is_profile_pic`) VALUES (?, ?, ?);',
            [userId, file.filename, isProfilePicture]
          )
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          this.user.pictures.push(file.filename)
          if (isEmpty(this.user.profilePic)) this.user.profilePic = file.filename
          return resolve(this.user)
        })
        .catch((err) => {
          fs.unlinkSync(`./src/assets/uploads/${file.filename}`)
          return reject(err)
        })
    ))
  }

  addProfileView(receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query(
        'UPDATE `users` SET `users`.`popularity` = '
        + 'IF (`users`.`popularity` + ? >= ?, ?, `users`.`popularity` + ?) '
        + 'WHERE `users`.`id` = ?;',
        [
          POPULARITY_POINTS.PROFILE_VIEW,
          BOUNDARY_VALUES.POPULARITY_MAX,
          BOUNDARY_VALUES.POPULARITY_MAX,
          POPULARITY_POINTS.PROFILE_VIEW,
          receiverId,
        ]
      )
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  addRecoverPasswordToken(email, redirectUri) {
    const token = random(255)
    return new Promise((resolve, reject) => (
      this.fetchInformationByEmail(email)
        .then(() => (
          this.database.query(
            'INSERT INTO `users_password_recovery` (`token`, `user_id`, `expiration_date`) VALUES (?, ?, NOW() + INTERVAL 1 DAY);',
            [
              token,
              this.user.id,
            ]
          )
        ))
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.mail.passwordRecovery(this.user, token, redirectUri)
        })
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  addReport(emitterId, receiverId) {
    const emitter = {}
    const receiver = {}
    return new Promise((resolve, reject) => (
      this.database.query('SELECT `username`, `email` FROM `users` WHERE `id` = ?;', [emitterId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('No user found.')
          emitter.username = rows[0].username
          emitter.email = rows[0].email
          return this.database.query('SELECT `username`, `email` FROM `users` WHERE `id` = ?;', [receiverId])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('No user found.')
          receiver.username = rows[0].username
          receiver.email = rows[0].email
          return this.database.query('INSERT INTO `users_fakes` (`reporter_id`, `reported_id`) VALUES (?, ?);', [emitterId, receiverId])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.mail.reportUser(emitter, receiver)
        })
        .then(() => this.mail.warnAdminOfUserReporting(emitter, receiver))
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  deleteLike(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_likes` WHERE `liker_id`= ? AND `liked_id` = ? ;', [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return this.database.query(
            'UPDATE `users` SET `users`.`popularity` = '
            + 'IF (`users`.`popularity` - ? <= ?, ?, `users`.`popularity` - ?) '
            + 'WHERE `users`.`id` = ?;',
            [
              POPULARITY_POINTS.UNLIKE,
              BOUNDARY_VALUES.POPULARITY_MIN,
              BOUNDARY_VALUES.POPULARITY_MIN,
              POPULARITY_POINTS.UNLIKE,
              receiverId,
            ]
          )
        })
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  deletePicture(userId, filename) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => {
          if (this.user.pictures.indexOf(filename) === -1) throw new Error('Wrong filename.')
          if (this.user.profilePic === filename) this.user.profilePic = null
          this.user.pictures = this.user.pictures.filter(el => el !== filename)
          return this.database.query('DELETE FROM `users_pictures` WHERE `user_id` = ? AND `filename` = ? LIMIT 1;', [userId, filename])
        })
        .then(() => {
          if (this.user.pictures.length > 0 && this.user.profilePic === null) {
            [this.user.profilePic] = this.user.pictures
            return this.database.query('UPDATE `users_pictures` SET `is_profile_pic` = 1 WHERE `filename` = ?', [this.user.profilePic])
          }
          return resolve(this.user)
        })
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  fetchAll(userId) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => (
          this.database.query(
            ' SELECT DISTINCT '
            + '  `users`.`id`, '
            + '  `users`.`username`, '
            + '  `users`.`firstname`, '
            + '  `users`.`lastname`, '
            + '   DATE_FORMAT(`users`.`birthday`, "%Y/%m/%d") AS birthday, '
            + '  `users`.`popularity`, '
            + '  `users`.`latitude`, '
            + '  `users`.`longitude`, '
            + '  `users`.`is_connected`, '
            + '  DATE_FORMAT(`users`.`last_connection`, "%Y/%m/%d %T") AS last_connection, '
            + '  `users_gender`.`gender`, '
            + '  `orientations`.`orientation`, '
            + '  `interests`.`interests`, '
            + '  `profile_pictures`.`profile_pic` '
            + ' FROM  '
            + '  `users` '
            + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender` '
            + ' LEFT JOIN ('
            + '    SELECT `users_sexual_orientation`.`user_id`, GROUP_CONCAT(DISTINCT `users_gender`.`gender`) AS orientation'
            + '    FROM `users_sexual_orientation`'
            + '    LEFT JOIN `users_gender` ON `users_gender`.`id` = `users_sexual_orientation`.`gender_id`'
            + '    GROUP BY `users_sexual_orientation`.`user_id`'
            + ' ) AS orientations ON `orientations`.`user_id` = `users`.`id` '
            + ' LEFT JOIN  ( '
            + '    SELECT `users_interests`.`user_id`, GROUP_CONCAT(DISTINCT `users_interests`.`tag` ORDER BY `users_interests`.`tag`) AS interests FROM `users_interests` GROUP BY `users_interests`.`user_id` '
            + ' ) AS interests ON `interests`.`user_id` = `users`.`id` '
            + ' LEFT JOIN ( '
            + '    SELECT `users_pictures`.`user_id`, `users_pictures`.`filename` AS profile_pic FROM `users_pictures` WHERE `users_pictures`.`is_profile_pic` = 1 '
            + ' ) AS profile_pictures ON `profile_pictures`.`user_id` = `users`.`id` '
            + ' WHERE `users`.`is_account_confirmed` = 1 AND NOT `users`.`id` = ? AND `users`.`id` NOT IN ('
            + '    SELECT `users_blocked`.`blocked_id` FROM `users_blocked` WHERE `users_blocked`.`blocker_id` = ?'
            + ' )'
            + ' ORDER BY `users`.`id`',
            [userId, userId]
          )
        ))
        .then((usersList) => {
          const users = []
          usersList.forEach((user) => {
            const interests = (isEmpty(user.interests)) ? null : user.interests.split(',')
            const sexualOrientation = (isEmpty(user.orientation)) ? null : user.orientation.split(',')
            users.push({
              id: user.id,
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              fullname: user.firstname.concat(' ', user.lastname),
              age: userGetAgeFromDate(user.birthday),
              popularity: user.popularity,
              latitude: user.latitude,
              longitude: user.longitude,
              is_connected: user.is_connected,
              gender: user.gender,
              orientation: sexualOrientation,
              interests,
              profilePic: user.profile_pic,
            })
          })
          return resolve({ users, currentUser: this.user })
        })
        .catch(err => reject(err))
    ))
  }

  fetchInformationByEmail(email) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`username`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`email`, '
        + '   `users`.`salt`, '
        + '   `users`.`password`, '
        + '   DATE_FORMAT(`users`.`creation`, "%Y/%m/%d %T") AS creation, '
        + '   DATE_FORMAT(`users`.`birthday`, "%Y/%m/%d") AS birthday, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`latitude`, '
        + '   `users`.`longitude`, '
        + '   `users_gender`.`gender`, '
        + '   `orientations`.`orientation`, '
        + '   `users_registration`.`token`,'
        + '  `interests`.`interests` '
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN ('
        + '    SELECT `users_sexual_orientation`.`user_id`, GROUP_CONCAT(DISTINCT `users_gender`.`gender`) AS orientation'
        + '    FROM `users_sexual_orientation`'
        + '    LEFT JOIN `users_gender` ON `users_gender`.`id` = `users_sexual_orientation`.`gender_id`'
        + '    GROUP BY `users_sexual_orientation`.`user_id`'
        + ' ) AS orientations ON `orientations`.`user_id` = `users`.`id` '
        + ' LEFT JOIN  ( '
        + '    SELECT `users_interests`.`user_id`, GROUP_CONCAT(DISTINCT `users_interests`.`tag` ORDER BY `users_interests`.`tag`) AS interests FROM `users_interests` GROUP BY `users_interests`.`user_id` '
        + ' ) AS interests ON `interests`.`user_id` = `users`.`id` '
        + ' LEFT JOIN `users_registration` ON `users_registration`.`user_id` = `users`.`id` '
        + ' WHERE `users`.`email` = ?'
        + ' GROUP BY `users`.`id`'
        + ' ORDER BY `users_registration`.`expiration_date` DESC'
        + ' LIMIT 1;',
        [email]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('No user found.')
          this.user.id = rows[0].email
          this.user.username = rows[0].username
          this.user.lastname = rows[0].lastname
          this.user.firstname = rows[0].firstname
          this.user.fullname = this.user.firstname.concat(' ', this.user.lastname)
          this.user.email = rows[0].email
          this.user.age = userGetAgeFromDate(rows[0].birthday)
          this.user.birthday = rows[0].birthday
          this.user.creation = rows[0].creation
          this.user.gender = rows[0].gender
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          this.user.orientation = (isEmpty(rows[0].orientation)) ? null : rows[0].orientation.split(',')
          this.user.popularity = rows[0].popularity
          this.user.biography = rows[0].biography
          this.user.latitude = rows[0].latitude
          this.user.longitude = rows[0].longitude
          this.user.registrationToken = rows[0].token
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          return this.fetchPictures(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user pictures.')
          return this.fetchLikes(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user likes.')
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchInformationById(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`username`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`email`, '
        + '   `users`.`salt`, '
        + '   `users`.`password`, '
        + '   DATE_FORMAT(`users`.`creation`, "%Y/%m/%d %T") AS creation, '
        + '   DATE_FORMAT(`users`.`birthday`, "%Y/%m/%d") AS birthday, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`latitude`, '
        + '   `users`.`longitude`, '
        + '   `users_gender`.`gender`, '
        + '   `orientations`.`orientation`, '
        + '   `users_registration`.`token`,'
        + '  `interests`.`interests` '
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN ('
        + '    SELECT `users_sexual_orientation`.`user_id`, GROUP_CONCAT(DISTINCT `users_gender`.`gender`) AS orientation'
        + '    FROM `users_sexual_orientation`'
        + '    LEFT JOIN `users_gender` ON `users_gender`.`id` = `users_sexual_orientation`.`gender_id`'
        + '    GROUP BY `users_sexual_orientation`.`user_id`'
        + ' ) AS orientations ON `orientations`.`user_id` = `users`.`id` '
        + ' LEFT JOIN  ( '
        + '    SELECT `users_interests`.`user_id`, GROUP_CONCAT(DISTINCT `users_interests`.`tag` ORDER BY `users_interests`.`tag`) AS interests FROM `users_interests` GROUP BY `users_interests`.`user_id` '
        + ' ) AS interests ON `interests`.`user_id` = `users`.`id` '
        + ' LEFT JOIN `users_registration` ON `users_registration`.`user_id` = `users`.`id` '
        + ' WHERE `users`.`id` = ?'
        + ' ORDER BY `users_registration`.`expiration_date` DESC;',
        [id]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('No user found.')
          this.user.id = id
          this.user.username = rows[0].username
          this.user.lastname = rows[0].lastname
          this.user.firstname = rows[0].firstname
          this.user.fullname = this.user.firstname.concat(' ', this.user.lastname)
          this.user.email = rows[0].email
          this.user.age = userGetAgeFromDate(rows[0].birthday)
          this.user.birthday = rows[0].birthday
          this.user.creation = rows[0].creation
          this.user.gender = rows[0].gender
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          this.user.orientation = (isEmpty(rows[0].orientation)) ? null : rows[0].orientation.split(',')
          this.user.popularity = rows[0].popularity
          this.user.biography = rows[0].biography
          this.user.latitude = rows[0].latitude
          this.user.longitude = rows[0].longitude
          this.user.registrationToken = rows[0].token
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          return this.fetchPictures(id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user pictures.')
          return this.fetchLikes(id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user likes.')
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchInformationByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`username`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`email`, '
        + '   `users`.`salt`, '
        + '   `users`.`password`, '
        + '   DATE_FORMAT(`users`.`creation`, "%Y/%m/%d %T") AS creation, '
        + '   DATE_FORMAT(`users`.`birthday`, "%Y/%m/%d") AS birthday, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`latitude`, '
        + '   `users`.`longitude`, '
        + '   `users_gender`.`gender`, '
        + '   `orientations`.`orientation`, '
        + '   `users_registration`.`token`,'
        + '  `interests`.`interests` '
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN ('
        + '    SELECT `users_sexual_orientation`.`user_id`, GROUP_CONCAT(DISTINCT `users_gender`.`gender`) AS orientation'
        + '    FROM `users_sexual_orientation`'
        + '    LEFT JOIN `users_gender` ON `users_gender`.`id` = `users_sexual_orientation`.`gender_id`'
        + '    GROUP BY `users_sexual_orientation`.`user_id`'
        + ' ) AS orientations ON `orientations`.`user_id` = `users`.`id` '
        + ' LEFT JOIN  ( '
        + '    SELECT `users_interests`.`user_id`, GROUP_CONCAT(DISTINCT `users_interests`.`tag` ORDER BY `users_interests`.`tag`) AS interests FROM `users_interests` GROUP BY `users_interests`.`user_id` '
        + ' ) AS interests ON `interests`.`user_id` = `users`.`id` '
        + ' LEFT JOIN `users_registration` ON `users_registration`.`user_id` = `users`.`id` '
        + ' WHERE `users`.`username` = ?'
        + ' GROUP BY `users`.`id`'
        + ' ORDER BY `users_registration`.`expiration_date` DESC'
        + ' LIMIT 1;',
        [username]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('No user found.')
          if (hash(password, rows[0].salt) !== rows[0].password) throw new Error('Password is incorrect.')
          this.user.id = rows[0].id
          this.user.username = rows[0].username
          this.user.lastname = rows[0].lastname
          this.user.firstname = rows[0].firstname
          this.user.fullname = this.user.firstname.concat(' ', this.user.lastname)
          this.user.email = rows[0].email
          this.user.age = userGetAgeFromDate(rows[0].birthday)
          this.user.birthday = rows[0].birthday
          this.user.creation = rows[0].creation
          this.user.gender = rows[0].gender
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          this.user.orientation = (isEmpty(rows[0].orientation)) ? null : rows[0].orientation.split(',')
          this.user.popularity = rows[0].popularity
          this.user.biography = rows[0].biography
          this.user.latitude = rows[0].latitude
          this.user.longitude = rows[0].longitude
          this.user.registrationToken = rows[0].token
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
          this.user.interests = (isEmpty(rows[0].interests)) ? null : rows[0].interests.split(',')
          return this.fetchPictures(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user pictures.')
          return this.fetchLikes(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user likes.')
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchLikes(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT *'
        + ' FROM `users_likes` '
        + ' LEFT JOIN `users` ON `users_likes`.`liker_id` = `users`.`id` '
        + ' WHERE `users_likes`.`liked_id` = ?'
        + ' ORDER BY `users_likes`.`date` DESC ;',
        [id]
      )
        .then((rows) => {
          this.liked = []
          rows.forEach((like) => {
            this.liked.push({ id: like.id, username: like.username, at: like.date })
          })
          return this.database.query(
            '   SELECT *'
            + ' FROM `users_likes` '
            + ' LEFT JOIN `users` ON `users_likes`.`liked_id` = `users`.`id` '
            + ' WHERE `users_likes`.`liker_id` = ?'
            + ' ORDER BY `users_likes`.`date` DESC ;',
            [id]
          )
        })
        .then((rows) => {
          this.likes = []
          rows.forEach((like) => {
            this.likes.push({ id: like.id, username: like.username, at: like.date })
          })
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchPictures(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `filename`, '
        + '   `is_profile_pic`, '
        + '   `import` '
        + ' FROM `users_pictures` '
        + ' WHERE `user_id` = ?'
        + ' ORDER BY `is_profile_pic` DESC, `import` DESC;',
        [id]
      )
        .then((rows) => {
          this.user.pictures = []
          this.user.profilePic = null
          rows.forEach((pic) => {
            if (pic.is_profile_pic) this.user.profilePic = pic.filename
            this.user.pictures.push(pic.filename)
          })
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  // fetchRegistrationToken(id) {
  //   return new Promise((resolve, reject) => (
  //     this.database.query(
  //       'SELECT `token` FROM `users_registration` '
  //       + 'WHERE `user_id` = ? ORDER BY `expiration_date` DESC LIMIT 1;',
  //       [id]
  //     )
  //       .then((rows) => {
  //         if (!isEmpty(rows)) this.user.registrationToken = rows[0].token
  //         return resolve(this.user)
  //       })
  //       .catch(err => reject(err))
  //   ))
  // }

  setProfilePicture(userId, filename) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => (
          this.database.query('UPDATE `users_pictures` SET `is_profile_pic` = 0 WHERE `filename` = ?;', [this.user.profilePic])
        ))
        .then(() => (
          this.database.query('UPDATE `users_pictures` SET `is_profile_pic` = 1 WHERE `filename` = ?;', [filename])
        ))
        .then(() => this.fetchPictures())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  setConnected(id) {
    return new Promise((resolve, reject) => (
      this.database.query('UPDATE `users` SET `is_connected` = 1 WHERE `id` = ?;', [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('Cannot found user.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  setDisconnected(id) {
    return new Promise((resolve, reject) => (
      this.database.query('UPDATE `users` SET `is_connected` = 0, `last_connection` = NOW() WHERE `id` = ?;', [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('Cannot found user.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  verifyPasswordRecoveryToken(token) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '  SELECT `user_id`, `expiration_date` '
        + 'FROM `users_password_recovery` '
        + 'WHERE `token` = ? AND `expiration_date` > NOW();',
        [token]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('Token is incorrect or has expired.')
          return this.fetchInformationById(rows[0].user_id)
        })
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  verifyRegistrationToken(token) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '  SELECT `user_id`, `expiration_date` '
        + 'FROM `users_registration` '
        + 'WHERE `token` = ? AND `expiration_date` > NOW();',
        [token]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('Token is incorrect or has expired.')
          return this.fetchInformationById(rows[0].user_id)
        })
        .then(() => this.database.query(
          'UPDATE `users` SET `is_account_confirmed` = 1 WHERE `id` = ?;',
          [this.user.id]
        ))
        .then(() => {
          if (this.user.isAccountConfirmed) throw new Error('Account has already been activated.')
          this.user.isAccountConfirmed = 1
          return this.database.query(
            'DELETE FROM `users_registration` WHERE `token` = ?',
            [token]
          )
        })
        .then(() => this.addIdentificationToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  verifyIdentifiationToken(token) {
    return new Promise((resolve, reject) => (
      this.jwt.check(token)
        .then((data) => {
          if (isEmpty(data)) throw new Error('Cannot check user token.')
          return this.fetchInformationById(data.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error('Cannot fetch user information.')
          return this.jwt.delete(token)
        })
        .then(() => this.addIdentificationToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }
}

module.exports = User
