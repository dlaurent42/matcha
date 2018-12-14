const Database = require('./Database')
const Mail = require('./Mail')
const JsonWebToken = require('./JsonWebToken')
const {
  hash,
  random,
  isEmpty,
} = require('../utils')

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
      orientation: null,
      popularity: 0,
      biography: null,
      location: null,
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

  add(user) {
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
          return this.mail.registration(this.user)
        })
        .then(() => this.createToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  addLike(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database('INSERT INTO `users_likes` (`liker_id`, `liked_id`) VALUES (?, ?);', [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  createToken() {
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

  deleteLike(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database('DELETE FROM `users_likes` WHERE `liker_id`= ? AND `liked_id` = ? ;', [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
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
        + '   `users`.`creation`, '
        + '   `users`.`birthday`, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`location`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`, '
        + '   `users_registration`.`token`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' LEFT JOIN `users_registration` ON `users_registration`.`user_id` = `users`.`id` '
        + ' WHERE `users`.`id` = ?'
        + ' ORDER BY `users_registration`.`expiration_date` DESC'
        + ' LIMIT 1;',
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
          this.user.age = (isEmpty(rows[0].birthday))
            ? null
            : 'x' // calculate age from birthday TO DO
          this.user.birthday = rows[0].birthday
          this.user.creation = rows[0].creation
          this.user.gender = rows[0].gender
          this.user.orientation = rows[0].orientation
          this.user.popularity = rows[0].popularity
          this.user.biography = rows[0].biography
          this.user.location = rows[0].location
          this.user.registrationToken = rows[0].token
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
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
        + '   `users`.`creation`, '
        + '   `users`.`birthday`, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`location`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`, '
        + '   `users_registration`.`token`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' LEFT JOIN `users_registration` ON `users_registration`.`user_id` = `users`.`id` '
        + ' WHERE `users`.`username` = ?'
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
          this.user.age = (isEmpty(rows[0].birthday))
            ? null
            : 'x' // calculate age from birthday TO DO
          this.user.birthday = rows[0].birthday
          this.user.creation = rows[0].creation
          this.user.gender = rows[0].gender
          this.user.orientation = rows[0].orientation
          this.user.popularity = rows[0].popularity
          this.user.biography = rows[0].biography
          this.user.location = rows[0].location
          this.user.registrationToken = rows[0].token
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
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
        + '   `picture`, '
        + '   `is_profile_pic` '
        + ' FROM `users_pictures` '
        + ' WHERE `user_id` = ?;',
        [id]
      )
        .then((rows) => {
          this.pictures = []
          rows.forEach((pic) => {
            if (pic.is_profile_pic) this.profilePic = pic.pictures
            this.pictures.push(pic.picture)
          })
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchRegistrationToken(id) {
    return new Promise((resolve, reject) => (
      this.database.query('SELECT `token` FROM `users_registration` WHERE `user_id` = ? ORDER BY `expiration_date` DESC LIMIT 1;', [id])
        .then((rows) => {
          if (!isEmpty(rows)) this.user.registrationToken = rows[0].token
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  verifyAccount(token) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '  SELECT `user_id`, `expiration_date` '
        + 'FROM `users_registration` '
        + 'WHERE `token` = ? AND `expiration_date` > CURDATE();',
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
        .then(() => this.createToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  verifyToken(token) {
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
        .then(() => this.createToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }
}

module.exports = User
