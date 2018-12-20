// auth
const authToken = require('./../routes/auth/token')
const authCredentials = require('./../middlewares/auth')

// user
const userAdd = require('./../routes/user/add')
const userAuthenticate = require('./../routes/user/authenticate')
const userGetById = require('./../routes/user/id')
const userConfirmAccount = require('./../routes/user/confirmAccount')
const userTokenVerify = require('./../routes/user/token/verify')
const userTokenBan = require('./../routes/user/token/ban')

// chat
const chatAddMessage = require('./../routes/chat/add')
const chatDeleteAllConversations = require('./../routes/chat/deleteAllConversations')
const chatDeleteConversation = require('./../routes/chat/deleteConversation')
const chatListConversations = require('./../routes/chat/listConversations')
const chatListMessages = require('./../routes/chat/listMessages')

// notifications
const notifDelete = require('./../routes/notification/delete')
const notifDeleteAll = require('./../routes/notification/deleteAll')
const notifLike = require('./../routes/notification/like')
const notifList = require('./../routes/notification/list')
const notifVieweded = require('./../routes/notification/viewed')
const notifViewededAll = require('./../routes/notification/viewedAll')
const notifProfileView = require('./../routes/notification/profileView')
const notifUnlike = require('./../routes/notification/unlike')

class Router {
  constructor(app) {
    this.app = app
    this.routes = {
      '/auth': [authToken],
      '': [authCredentials],
      '/user': [
        userAdd,
        userAuthenticate,
        userConfirmAccount,
        userGetById,
      ],
      '/user/token': [
        userTokenVerify,
        userTokenBan,
      ],
      '/chat': [
        chatAddMessage,
        chatDeleteAllConversations,
        chatDeleteConversation,
        chatListConversations,
        chatListMessages,
      ],
      '/notification': [
        notifDelete,
        notifDeleteAll,
        notifLike,
        notifList,
        notifVieweded,
        notifViewededAll,
        notifProfileView,
        notifUnlike,
      ],
    }
  }

  setAllRoutes() {
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].forEach((element) => {
        if (route === '') this.app.use(element)
        else this.app.use(route, element)
      })
    })
  }
}

module.exports = Router
