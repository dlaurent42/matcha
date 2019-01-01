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
const { ERRORS } = require('../config/constants').RESPONSES
const { USERS } = require('../config/constants').QUERIES

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
      this.database.query(USERS.GET_COUNT_BY_MAIL_AND_EMAIL, [user.username, user.email])
        .then((rows) => {
          if (rows[0].count > 0) throw new Error(ERRORS.USER_ACCOUNT_EXISTS)
          const salt = random(255)
          const password = hash(user.password, salt)
          this.user.username = user.username
          this.user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)
          this.user.lastname = user.lastname.toUpperCase()
          this.user.fullname = this.user.firstname.concat(' ', this.user.lastname)
          this.user.email = user.email
          return (this.database.query(
            USERS.ADD_REGISTRATION_INFO,
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
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          this.user.id = rows.insertId
          this.user.registrationToken = random(255)
          return (this.database.query(
            USERS.ADD_REGISTRATION_TOKEN,
            [this.user.registrationToken, this.user.id]
          ))
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return this.mail.registration(this.user, redirectUri)
        })
        .then(() => this.addIdentificationToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  addBlock(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.ADD_BLOCK, [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return this.database.query(
            USERS.SET_LESS_POPULARITY,
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
          if (isEmpty(newToken)) throw new Error(ERRORS.JWT_CREATION)
          this.user.identificationToken = newToken
          return resolve(this.user)
        })
        .catch(err => reject(err))
    })
  }

  addLike(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.ADD_LIKE, [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return this.database.query(
            USERS.SET_MORE_POPULARITY,
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
          if (this.user.pictures.length >= 5) throw new Error(ERRORS.USER_MAX_PICTURES)
          const isProfilePicture = (this.user.pictures.length === 0)
          return this.database.query(USERS.ADD_PICTURE, [userId, file.filename, isProfilePicture])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
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
        USERS.SET_MORE_POPULARITY,
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
        .then(() => this.database.query(USERS.ADD_PASSWORD_RECOVERY_TOKEN, [token, this.user.id]))
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
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
      this.database.query(USERS.GET_USERNAME_AND_EMAIL, [emitterId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
          emitter.username = rows[0].username
          emitter.email = rows[0].email
          return this.database.query(USERS.GET_USERNAME_AND_EMAIL, [receiverId])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
          receiver.username = rows[0].username
          receiver.email = rows[0].email
          return this.database.query(USERS.ADD_REPORT, [emitterId, receiverId])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return this.mail.reportUser(emitter, receiver)
        })
        .then(() => this.mail.warnAdminOfUserReporting(emitter, receiver))
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  delete(userId) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.DELETE_USER.USER, [userId])
        .then(() => this.database.query(USERS.DELETE_USER.BLOCKED, [userId, userId]))
        .then(() => this.database.query(USERS.DELETE_USER.INTERESTS, [userId]))
        .then(() => this.database.query(USERS.DELETE_USER.LIKES, [userId, userId]))
        .then(() => this.database.query(USERS.DELETE_USER.MESSAGES, [userId, userId]))
        .then(() => this.database.query(USERS.DELETE_USER.NOTIFICATIONS, [userId]))
        .then(() => this.database.query(USERS.DELETE_USER.PASS_RECOVERY, [userId]))
        .then(() => this.database.query(USERS.GET_PICTURES, [userId]))
        .then((rows) => {
          if (!isEmpty(rows)) {
            rows.forEach((row) => {
              fs.unlinkSync(`./src/assets/uploads/${row.filename}`)
            })
          }
          return this.database.query(USERS.DELETE_USER.PICTURES, [userId])
        })
        .then(() => this.database.query(USERS.DELETE_USER.REGISTRATION, [userId]))
        .then(() => this.database.query(USERS.DELETE_USER.SEXUAL_ORIENTATION, [userId]))
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  deleteLike(emitterId, receiverId) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.DELETE_LIKE, [emitterId, receiverId])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return this.database.query(
            USERS.SET_LESS_POPULARITY,
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
          if (this.user.pictures.indexOf(filename) === -1) {
            throw new Error(ERRORS.USER_PICTURE_FILENAME)
          }
          if (this.user.profilePic === filename) this.user.profilePic = null
          this.user.pictures = this.user.pictures.filter(el => el !== filename)
          return this.database.query(USERS.DELETE_PICTURE, [userId, filename])
        })
        .then(() => {
          if (this.user.pictures.length > 0 && this.user.profilePic === null) {
            [this.user.profilePic] = this.user.pictures
            return this.database.query(USERS.SET_PROFILE_PICTURE, [1, this.user.profilePic])
          }
          fs.unlinkSync(`./src/assets/uploads/${filename}`)
          return resolve(this.user)
        })
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  fetchAll(userId) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => this.database.query(USERS.GET_ALL_USERS, [userId, userId, userId, userId]))
        .then((usersList) => {
          const users = []
          usersList.forEach((user) => {
            const interests = (isEmpty(user.interests)) ? null : user.interests.split(',')
            const sexualOrientation = (isEmpty(user.orientation)) ? null : user.orientation.split(',')
            const link = (!isEmpty(user.liker_id))
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
              link,
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
      this.database.query(USERS.GET_USER_BY_CONDITION({ condition: 'email' }), [email])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
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
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_PICTURES)
          return this.fetchLikes(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_LIKES)
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchInformationById(id) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.GET_USER_BY_CONDITION({ condition: 'id' }), [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
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
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_PICTURES)
          return this.fetchLikes(id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_LIKES)
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchInformationByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.GET_USER_BY_CONDITION({ condition: 'username' }), [username])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
          if (hash(password, rows[0].salt) !== rows[0].password) throw new Error(ERRORS.USER_PASSWD)
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
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_PICTURES)
          return this.fetchLikes(this.user.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.USER_FETCH_LIKES)
          return resolve(this.user)
        })
        .catch(err => reject(err))
    ))
  }

  fetchLikes(id) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.GET_LIKES[0], [id])
        .then((rows) => {
          this.liked = []
          rows.forEach((like) => {
            this.liked.push({ id: like.id, username: like.username, at: like.date })
          })
          return this.database.query(USERS.GET_LIKES[1], [id])
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
      this.database.query(USERS.GET_PICTURES, [id])
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

  setProfilePicture(userId, filename) {
    return new Promise((resolve, reject) => (
      this.fetchInformationById(userId)
        .then(() => this.database.query(USERS.SET_PROFILE_PICTURE, [0, this.user.profilePic]))
        .then(() => this.database.query(USERS.SET_PROFILE_PICTURE, [1, filename]))
        .then(() => this.fetchPictures())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  setConnected(id) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.SET_CONNECTED, [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  setDisconnected(id) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.SET_DISCONNECTED, [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_NO_USER)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  verifyPasswordRecoveryToken(token) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.GET_PASSWORD_RECOVERY_TOKEN, [token])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_TOKEN_EXPIRED)
          return this.fetchInformationById(rows[0].user_id)
        })
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }

  verifyRegistrationToken(token) {
    return new Promise((resolve, reject) => (
      this.database.query(USERS.GET_REGISTRATION_TOKEN, [token])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.USER_TOKEN_EXPIRED)
          return this.fetchInformationById(rows[0].user_id)
        })
        .then(() => this.database.query(USERS.SET_ACCOUNT_CONFIRMED, [this.user.id]))
        .then(() => {
          if (this.user.isAccountConfirmed) throw new Error(USERS.USER_ACCOUNT_ACTIVATED)
          this.user.isAccountConfirmed = 1
          return this.database.query(USERS.DELETE_REGISTRATION_TOKEN, [token])
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
          if (isEmpty(data)) throw new Error(ERRORS.GENERAL)
          return this.fetchInformationById(data.id)
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.USER_NO_USER)
          return this.jwt.delete(token)
        })
        .then(() => this.addIdentificationToken())
        .then(() => resolve(this.user))
        .catch(err => reject(err))
    ))
  }
}

module.exports = User
