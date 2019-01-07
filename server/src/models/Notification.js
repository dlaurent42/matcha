const Database = require('./Database')
const { isEmpty } = require('../utils')
const { NOTIFICATIONS } = require('../config/constants').QUERIES
const { ERRORS } = require('../config/constants').RESPONSES

class Notification {
  constructor() {
    this.notifications = []
    this.database = new Database()
  }

  delete(id) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.DELETE_NOTIFICATION, [id])
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  deleteAll(uid) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.DELETE_NOTIFICATION, [uid])
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  like(emitter, receiver) {
    let isMatch = false
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.GET_LIKE, [receiver, emitter])
        .then((rows) => {
          const type = (rows[0].count === 0)
            ? 'like'
            : 'match'
          if (type === 'match') isMatch = true
          return this.database.query(NOTIFICATIONS.ADD_LIKE, [emitter, receiver, type])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          if (isMatch === true) {
            return this.database.query(NOTIFICATIONS.ADD_MATCH, [receiver, emitter])
          }
          return resolve()
        })
        .then(() => this.database.query(NOTIFICATIONS.DELETE_UNLIKE, [receiver, emitter]))
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  unlike(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.DELETE_LIKE, [emitter, receiver])
        .then(() => this.database.query(NOTIFICATIONS.ADD_DISLIKE, [emitter, receiver]))
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  list(uid) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.GET_ALL, [uid])
        .then((rows) => {
          rows.forEach((notification) => {
            this.notifications.push({
              notification_id: notification.id,
              emitter_id: notification.emitter_id,
              emitter_username: notification.username,
              type: notification.type,
              viewed: notification.is_opened,
              date: notification.creation,
            })
          })
          resolve(this.notifications)
        })
        .catch(err => reject(err))
    ))
  }

  message(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.ADD_MESSAGE, [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  profileView(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.ADD_PROFILE_VIEW, [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  viewed(id) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.SET_VIEWED, [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  viewedAll(id) {
    return new Promise((resolve, reject) => (
      this.database.query(NOTIFICATIONS.SET_ALL_VIEWED, [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }
}

module.exports = Notification
