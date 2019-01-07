const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const socketio = require('socket.io')

const Router = require('./models/Router')
const Socket = require('./models/Socket')
const { SERVER } = require('./config/config')

class Server {
  constructor() {
    this.app = express()
    this.app.use(morgan('combined'))
    this.app.use('/assets', express.static('src/assets/uploads'), express.static('src/assets/seed'))
    this.app.use(bodyParser.json())
    this.app.use(cors())
    this.http = http.Server(this.app)
    this.socket = socketio(this.http)
    this.routes = new Router(this.app).setAllRoutes()
    this.events = new Socket(this.socket).socketEvents()
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

const server = new Server()
server.listen()
