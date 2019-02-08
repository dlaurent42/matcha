// middlewares/
const authCredentials = require('../middlewares/auth')

// routes/auth
const authGet = require('../routes/auth/get')
const authGetId = require('../routes/auth/getId')
const authPost = require('../routes/auth/post')

// routes/chat
const chatDeleteConversation = require('../routes/chat/deleteConversation')
const chatGetMessage = require('../routes/chat/getMessage')
const chatGetConversation = require('../routes/chat/getConversation')
const chatPostMessage = require('../routes/chat/postMessage')

// routes/notifications
const notifDelete = require('../routes/notification/delete')
const notifDeleteAll = require('../routes/notification/deleteAll')
const notifDeleteLike = require('../routes/notification/deleteLike')
const notifGet = require('../routes/notification/get')
const notifPostLike = require('../routes/notification/postLike')
const notifPostProfile = require('../routes/notification/postProfile')
const notifPutAllViewed = require('../routes/notification/putAllViewed')
const notifPutViewed = require('../routes/notification/putViewed')

// routes/picture
const pictureDelete = require('../routes/picture/delete')
const picturePost = require('../routes/picture/post')
const picturePutProfile = require('../routes/picture/putProfile')

// routes/tags
const tagGet = require('../routes/tags/get')

// routes/token
const tokenDelete = require('../routes/token/delete')
const tokenGet = require('../routes/token/get')
const tokenPost = require('../routes/token/post')

// routes/user
const userDelete = require('../routes/user/delete')
const userDeleteBlock = require('../routes/user/deleteBlock')
const userGet = require('../routes/user/get')
const userGetAll = require('../routes/user/getAll')
const userGetAuthenticate = require('../routes/user/getAuthenticate')
const userGetGenders = require('../routes/user/getGenders')
const userPutRecoverPassword = require('../routes/user/putRecoverPassword')
const userPost = require('../routes/user/post')
const userPostBlock = require('../routes/user/postBlock')
const userPostEmailConfirmation = require('../routes/user/postEmailConfirmation')
const userPostRecoverPassword = require('../routes/user/postRecoverPassword')
const userPostReport = require('../routes/user/postReport')
const userPut = require('../routes/user/put')
const userPutConfirmAccount = require('../routes/user/putConfirmAccount')
const userPutPassword = require('../routes/user/putPassword')

class Router {
  constructor(app) {
    this.app = app
    this.routes = {
      '/auth': [authGet],
      '': [authCredentials],
      '/credentials': [
        authGetId,
        authPost,
      ],
      '/chat': [
        chatDeleteConversation,
        chatGetMessage,
        chatGetConversation,
        chatPostMessage,
      ],
      '/notification': [
        notifDelete,
        notifDeleteAll,
        notifGet,
        notifPostLike,
        notifDeleteLike,
        notifPostProfile,
        notifPutAllViewed,
        notifPutViewed,
      ],
      '/picture': [
        pictureDelete,
        picturePost,
        picturePutProfile,
      ],
      '/tags': [
        tagGet,
      ],
      '/token': [
        tokenDelete,
        tokenGet,
        tokenPost,
      ],
      '/user': [
        userDeleteBlock,
        userGetAll,
        userGetAuthenticate,
        userGetGenders,
        userPutRecoverPassword,
        userPostBlock,
        userPostEmailConfirmation,
        userPostRecoverPassword,
        userPostReport,
        userPutConfirmAccount,
        userPutPassword,
        userDelete,
        userGet,
        userPost,
        userPut,
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
