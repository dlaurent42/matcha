const express = require('express')
const http = require('http')
const _ = require('lodash')

const SERVER = {
  HOST: 'localhost',
  PORT: 8082,
}

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
        } else {
          this.correlationTable[uid].push(socket.id)
        }
      })

      // Remove all sockets Id when user logs out
      socket.on('logoutUser', (uid) => {
        this.correlationTable[uid] = []
      })

      // Handle notifications
      socket.on('notification', (notification) => {
        console.log(`Notification asked: (${notification}).`)
      })

      // Handle chat messages
      socket.on('message', (message) => {
        console.log(`Notification asked: (${message}).`)
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
