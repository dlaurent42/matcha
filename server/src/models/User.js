const Database = require('./Database')
const Mail = require('./Mail')
const {
  hash,
  random,
  isEmpty,
} = require('../utils')

class User {
  constructor() {
    this.database = new Database()
    this.mail = new Mail()
    this.user = {
      id: null,
      username: null,
      lastname: null,
      firstname: null,
      fullname: null,
      email: null,
      password: null,
      salt: null,
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
      registrationToken: null,
      isAccountConfirmed: false,
      isAccountComplete: false,
    }
  }

  fetchUserInformationById(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`username`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`email`, '
        + '   `users`.`creation`, '
        + '   `users`.`birthday`, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`location`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' WHERE `users`.`id` = ?'
        + ' LIMIT 1;',
        [id]
      )
        .then((rows) => {
          if (isEmpty(rows)) return reject()
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
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
          return this.fetchUserPictures(id)
        })
        .then((user) => {
          if (isEmpty(user)) return reject()
          return this.fetchUserLikes(id)
        })
        .then((user) => {
          if (isEmpty(user)) return reject()
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchUserInformationByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`username`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`email`, '
        + '   `users`.`creation`, '
        + '   `users`.`birthday`, '
        + '   `users`.`popularity`, '
        + '   `users`.`biography`, '
        + '   `users`.`is_account_confirmed`, '
        + '   `users`.`is_geolocation_allowed`, '
        + '   `users`.`location`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' WHERE `users`.`username` = ? AND `users`.`password` = ?'
        + ' LIMIT 1;',
        [username, password]
      )
        .then((rows) => {
          if (isEmpty(rows)) return reject()
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
          this.user.isGeolocalised = rows[0].is_geolocation_allowed
          this.user.isAccountConfirmed = rows[0].is_account_confirmed
          return this.fetchUserPictures(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) return reject()
          return this.fetchUserLikes(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) return reject()
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchUserLikes(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `users_likes`.`liker_id` AS id, '
        + '   `users_likes`.`liked_id`, '
        + '   `users_likes`.`date`, '
        + '   `users`.`username` AS by, '
        + ' FROM `users_likes` '
        + ' LEFT JOIN `users` ON `users_likes`.`liker_id` = `users`.`id` '
        + ' WHERE `users_likes`.`liked_id = ?'
        + ' ORDER BY `users_likes`.`date` DESC ;',
        [id]
      )
        .then((rows) => {
          this.liked = []
          rows.forEach((like) => {
            this.liked.push({ id: like.id, username: like.by, at: like.date })
          })
          return this.database.query(
            '   SELECT '
            + '   `users_likes`.`liker_id`, '
            + '   `users_likes`.`liked_id`, AS id'
            + '   `users_likes`.`date`, '
            + '   `users`.`username` AS by, '
            + ' FROM `users_likes` '
            + ' LEFT JOIN `users` ON `users_likes`.`liked_id` = `users`.`id` '
            + ' WHERE `users_likes`.`liker_id = ?'
            + ' ORDER BY `users_likes`.`date` DESC ;',
            [id]
          )
        })
        .then((rows) => {
          this.likes = []
          rows.forEach((like) => {
            this.likes.push({ id: like.id, username: like.by, at: like.date })
          })
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchUserPictures(id) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `picture`, '
        + '   `is_profile_pic`, '
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

  fetchUserRegistrationToken(id) {
    return new Promise((resolve, reject) => (
      this.database.query('SELECT `token` FROM `users_registration` WHERE `user_id` = ? ORDER BY `expiration_date` DESC LIMIT 1;', [id])
        .then((rows) => {
          if (!isEmpty(rows)) this.user.registrationToken = rows[0].token
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  add(user) {
    return new Promise((resolve, reject) => (
      this.database.query(
        'SELECT COUNT(*) AS count FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;',
        [user.username, user.email]
      )
        .then((rows) => {
          if (rows[0].count > 0) throw new Error('An account with entered email/username already exists')
          this.user.salt = random(255)
          this.user.password = hash(user.password, this.user.salt)
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
              this.user.password,
              this.user.salt,
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
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }
}

module.exports = User
