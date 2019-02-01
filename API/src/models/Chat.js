const Database = require('./Database')
const { isEmpty } = require('../utils')
const { ERRORS } = require('../config/constants').RESPONSES
const { CHAT } = require('../config/constants').QUERIES

class Chat {
  constructor() {
    this.database = new Database()
    this.conversations = []
    this.messages = []
  }

  addMessage(emitter, receiver, content) {
    return new Promise((resolve, reject) => (
      this.database.query(
        CHAT.ADD_MESSAGE,
        [
          emitter,
          receiver,
          emitter,
          receiver,
          content,
          receiver,
          emitter,
          emitter,
          receiver,
          content,
        ]
      )
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  deleteAllConversations(owner) {
    return new Promise((resolve, reject) => (
      this.database.query(CHAT.DELETE_CONVERSATIONS, [owner])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  deleteConversation(emitter, receiver) {
    return new Promise((resolve, reject) => (
      this.database.query(CHAT.DELETE_CONVERSATION, [emitter, receiver])
        .then((rows) => {
          if (isEmpty(rows)) throw new Error(ERRORS.GENERAL)
          return resolve()
        })
        .catch(err => reject(err))
    ))
  }

  listConversations(userId) {
    return new Promise((resolve, reject) => (
      this.database.query(CHAT.GET_CONVERSATIONS, [userId])
        .then((rows) => {
          this.conversations = []
          rows.forEach((conv) => {
            if (conv.emitter_id === conv.owner_id) {
              this.conversations.push({
                id: conv.receiver_id,
                username: conv.username,
                lastMessageDate: conv.creation,
              })
            } else {
              this.conversations.push({
                id: conv.emitter_id,
                username: conv.username,
                lastMessageDate: conv.creation,
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
        CHAT.GET_MESSAGES,
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
