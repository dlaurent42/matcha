// middlewares/
const authCredentials = require('../middlewares/auth')

// routes/auth
const authGet = require('../routes/auth/get')

// routes/chat
const chatDeleteMessage = require('../routes/chat/deleteMessage')
const chatDeleteConversation = require('../routes/chat/deleteConversation')
const chatGetMessage = require('../routes/chat/getMessage')
const chatGetConversation = require('../routes/chat/getConversation')

// routes/notifications
const notifDelete = require('../routes/notification/delete')
const notifDeleteAll = require('../routes/notification/deleteAll')
const notifDeleteLike = require('../routes/notification/deleteLike')
const notifGet = require('../routes/notification/get')
const notifPostLike = require('../routes/notification/postLike')
const notifPostProfile = require('../routes/notification/postProfile')
const notifPutAllViewed = require('../routes/notification/putAllViewed')
const notifPutViewed = require('../routes/notification/putViewed')

// routes/pictures
const pictureDelete = require('../routes/pictures/delete')
const picturePost = require('../routes/pictures/post')
const picturePutProfile = require('../routes/pictures/putProfile')

// routes/tags
const tagGet = require('../routes/tags/get')

// routes/token
const tokenGet = require('../routes/token/get')
const tokenDelete = require('../routes/token/delete')

// routes/user
const userDelete = require('../routes/user/delete')
const userDeleteBlock = require('../routes/user/deleteBlock')
const userGet = require('../routes/user/get')
const userGetAll = require('../routes/user/getAll')
const userGetAuthenticate = require('../routes/user/getAuthenticate')
const userPost = require('../routes/user/post')
const userPostBlock = require('../routes/user/postBlock')
const userPostRecoverPassword = require('../routes/user/postRecoverPassword')
const userPostReport = require('../routes/user/postReport')
const userPut = require('../routes/user/put')
const userPutConfirmAccount = require('../routes/user/putConfirmAccount')

class Router {
  constructor(app) {
    this.app = app
    this.routes = {
      '/auth': [authGet],
      '': [authCredentials],
      '/chat': [
        chatDeleteMessage,
        chatDeleteConversation,
        chatGetMessage,
        chatGetConversation,
      ],
      '/notification': [
        notifDelete,
        notifDeleteAll,
        notifDeleteLike,
        notifGet,
        notifPostLike,
        notifPostProfile,
        notifPutAllViewed,
        notifPutViewed,
      ],
      '/picture': [
        pictureDelete,
        picturePost,
        picturePutProfile,
      ],
      '/tag': [
        tagGet,
      ],
      '/user': [
        userDelete,
        userDeleteBlock,
        userGet,
        userGetAll,
        userGetAuthenticate,
        userPost,
        userPostBlock,
        userPostRecoverPassword,
        userPostReport,
        userPut,
        userPutConfirmAccount,
      ],
      '/token': [
        tokenGet,
        tokenDelete,
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
