const notificationsJsonList = require('./data/notifications.json')
const query = require('../utils/query')

const notifications = database => (
  new Promise((resolve, reject) => {
    const promises = []
    notificationsJsonList.forEach((notification) => {
      if (notification.emitter_id !== notification.receiver_id) {
        promises.push(
          query(
            database,
            'INSERT INTO `users_notifications` (`owner_id`, `with_id`, `emitter_id`, `receiver_id`, `type`, `is_opened`, `creation`) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [
              notification.emitter_id,
              notification.receiver_id,
              notification.emitter_id,
              notification.receiver_id,
              notification.type,
              notification.is_opened,
              notification.creation,
            ]
          ),
          query(
            database,
            'INSERT INTO `users_notifications` (`owner_id`, `with_id`, `emitter_id`, `receiver_id`, `type`, `is_opened`, `creation`) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [
              notification.receiver_id,
              notification.emitter_id,
              notification.emitter_id,
              notification.receiver_id,
              notification.type,
              notification.is_opened,
              notification.creation,
            ]
          )
        )
      }
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_notifications table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = notifications
