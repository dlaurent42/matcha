class Socket {
  constructor(socket) {
    this.io = socket
    this.currentConnections = []
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      console.log(`New user is connecting: ${socket}`)

      socket.on('userIdentify', async (data) => {
        try {
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      })

      socket.on('userLogout', async (data) => {
        try {
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      })

      socket.on('notification', async (data) => {
        try {
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      })
    })
  }
}

module.exports = Socket
