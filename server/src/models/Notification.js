const Database = require('./Database')
const { isEmpty } = require('../utils')

class Notification {
  constructor() {
    this.notifications = []
    this.database = new Database()
  }

  delete(id) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_notifications WHERE `id` = ?;`', [id])
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  deleteAll(uid) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_notifications WHERE `receiver_id` = ?;`', [uid])
        .then(() => resolve())
        .catch(err => reject(err))
    ))
  }

  like(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query('SELECT COUNT(*) AS count FROM `users_likes` WHERE `liker_id` = ? AND `liked_id` = ?;', [receiver, emitter])
        .then((rows) => {
          const type = (rows[0].count === 0)
            ? 'like'
            : 'match'
          return this.database.query('INSERT INTO `users_notifications (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, ?);`', [emitter, receiver, type])
        })
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  unlike(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_notifications` WHERE `emitter_id` = ? AND `receiver_id` = ? AND (`type` = \'like\' OR `type` = \'match\');', [emitter, receiver])
        .then(() => this.database.query('INSERT INTO `users_notifications (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'unlike\');`', [emitter, receiver]))
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  list(uid) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '  SELECT'
        + '  `users`.`username`, '
        + '  `users_notifications`.`emitter_id`, '
        + '  `users_notifications`.`type`, '
        + '  `users_notifications`.`content`, '
        + '  `users_notifications`.`is_opened`, '
        + '  `users_notifications`.`creation`, '
        + '  `users_notifications`.`creation` '
        + ' FROM `users_notifications`'
        + ' LEFT JOIN `users` ON `users`.`id` = `users_notifications`.`emitter_id` '
        + ' WHERE `users_notifications`.`receiver_id` = ? '
        + ' ORDER BY `users_notifications`.`creation` DESC; ',
        [uid]
      )
        .then((rows) => {
          console.log(JSON.stringify(rows))
          resolve(this.notifications)
        })
        .catch(err => reject(err))
    ))
  }

  message(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query('INSERT INTO `users_notifications (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'message\');`', [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  profileView(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query('INSERT INTO `users_notifications (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'view\');`', [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  viewed(id) {
    return new Promise((resolve, reject) => (
      this.database.query('UPDATE `users_notifications` SET `is_opened` = 1 WHERE `id` = ?;', [id])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }
}

module.exports = Notification
