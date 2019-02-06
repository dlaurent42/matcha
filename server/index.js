const express = require('express')
const http = require('http')
const _ = require('lodash')

const SERVER = {
  HOST: 'localhost',
  PORT: 8082,
}

const NOTIFICATION_TYPES = [
  'like',
  'match',
  'unlike',
  'profile',
]

class Server {
  constructor() {
    // Server variables
    this.app = express()
    this.http = http.Server(this.app)

    // Sockets handler
    this.io = require('socket.io')(this.http) // eslint-disable-line
    this.correlationTable = {}
    this.io.sockets.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`)
      // Add correlation UserId - SocketId when login event is triggered
      socket.on('loginUser', (uid) => {
        if (this.correlationTable[uid] === undefined) {
          Object.assign(this.correlationTable, { [uid]: [socket.id] })
          console.log(this.correlationTable[uid], uid)
        } else {
          this.correlationTable[uid].push(socket.id)
          console.log(this.correlationTable[uid], uid)
        }
      })

      // Remove all sockets Id when user logs out
      socket.on('logoutUser', (uid) => {
        this.correlationTable[uid] = []
      })

      // Handle notifications
      socket.on('notification', (notification) => {
        console.log(`Notification asked: (${notification}).`)
        if (notification.type && NOTIFICATION_TYPES.indexOf(notification.type) > -1
        && notification.emitter && notification.receiver) {
          console.log('Notification is valid.')
          if (this.correlationTable[notification.receiver] !== undefined
          && this.correlationTable[notification.receiver].length) {
            this.correlationTable[notification.receiver].forEach((socketId) => {
              console.log('Notification receiver is online.')
              this.io.to(`${socketId}`).emit('notification', {
                data: {
                  type: notification.type,
                  emitter: notification.emitter,
                },
              })
            })
          } else {
            console.log('Notification receiver is offline.')
          }
        } else console.log('Notification is invalid.')
      })

      // Handle chat messages
      socket.on('message', (message) => {
        console.log(`Message received: (${message}).`)
        if (message.emitter && message.receiver && message.content) {
          console.log('Message well formatted.')
          if (this.correlationTable[message.receiver]
          && this.correlationTable[message.receiver].length) {
            console.log('Message receiver is online.')
            this.correlationTable[message.receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('message', {
                data: {
                  content: message.content,
                  emitter: message.emitter,
                  receiver: message.receiver,
                },
              })
            })
          } else console.log('Message receiver is offline.')
        } else {
          console.log('Message not well formatted.')
        }
      })

      // [PRESET EVENT] remove socket Id from correlationTable
      socket.on('disconnect', () => {
        const key = _.findKey(this.correlationTable, socketIds => (
          socketIds.indexOf(socket.id) === 0
        ))
        _.remove(this.correlationTable[key], el => el === socket.id)
      })
    })
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

new Server().listen()
