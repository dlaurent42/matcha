const Database = require('./Database')
const { isEmpty } = require('../utils')

class Chat {
  constructor() {
    this.database = new Database()
    this.conversations = []
    this.messages = []
  }

  addMessage(emitter, receiver, content) {
    return new Promise((resolve, reject) => (
      this.database.query('INSERT INTO `users_messages` (`owner_id`, `with_id`, `emitter_id`, `receiver_id`, `content`) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);', [emitter, receiver, emitter, receiver, content, receiver, emitter, emitter, receiver, content])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  deleteAllConversations(owner) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_messages` WHERE `owner_id` = ?;', [owner])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  deleteConversation(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query('DELETE FROM `users_messages` WHERE `owner_id` = ? AND `with_id` = ? ;', [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  listConversations(userId) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '   SELECT '
        + '   `o`.*, '
        + '   `users`.`username` '
        + ' FROM `users_messages` o '
        + ' LEFT JOIN `users_messages` b ON `o`.`with_id` = `b`.`with_id` AND `o`.`creation` < `b`.`creation` '
        + ' LEFT JOIN `users` ON `o`.`with_id` = `users`.`id` '
        + ' WHERE `b`.`creation` is NULL AND `o`.`owner_id` = ? '
        + ' ORDER BY `b`.`creation` DESC;',
        [userId]
      )
        .then((rows) => {
          this.conversations = []
          rows.forEach((conv) => {
            if (conv.emitter_id === conv.owner_id) {
              this.conversations.push({
                id: conv.receiver_id,
                username: conv.username,
                seen: conv.seen,
                date: conv.creation,
              })
            } else {
              this.conversations.push({
                id: conv.emitter_id,
                username: conv.username,
                seen: conv.seen,
                date: conv.creation,
              })
            }
          })
          return resolve(this.conversations)
        })
        .catch(err => reject(err))
    ))
  }

  listMessages(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query(
        '  SELECT '
        + '  `users_messages`.`id`, '
        + '  `users_messages`.`emitter_id`, '
        + '  `a`.`username` AS \'emitter\', '
        + '  `users_messages`.`receiver_id`, '
        + '  `b`.`username` AS \'receiver\', '
        + '  `users_messages`.`content`, '
        + '  `users_messages`.`creation` '
        + 'FROM `users_messages` '
        + 'LEFT JOIN `users` a ON `users_messages`.`emitter_id` = a.`id`'
        + 'LEFT JOIN `users` b ON `users_messages`.`receiver_id` = b.`id`'
        + 'WHERE `owner_id` = ? AND `with_id` = ? '
        + 'ORDER BY `creation` DESC;',
        [emitter, receiver]
      )
        .then((rows) => {
          this.messages = []
          rows.forEach((message) => {
            this.messages.push({
              id: message.id,
              emitter_id: message.emitter_id,
              emitter: message.emitter,
              receiver_id: message.receiver_id,
              receiver: message.receiver,
              content: message.content,
              date: message.creation,
            })
          })
          return resolve(this.messages)
        })
        .catch(err => reject(err))
    ))
  }
}

module.exports = Chat
