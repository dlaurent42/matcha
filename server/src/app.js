// NPM installed modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config')

// ******** Developed modules ********
// auth
const authToken = require('./routes/auth/token')
const authCredentials = require('./middlewares/auth')

// user
const userAdd = require('./routes/user/add')
const userAuthenticate = require('./routes/user/authenticate')
const userGetById = require('./routes/user/id')
const userConfirmAccount = require('./routes/user/confirmAccount')
const userTokenVerify = require('./routes/user/token/verify')
const userTokenBan = require('./routes/user/token/ban')

// chat
const chatAddMessage = require('./routes/chat/add')
const chatDeleteAllConversations = require('./routes/chat/deleteAllConversations')
const chatDeleteConversation = require('./routes/chat/deleteConversation')
const chatListConversations = require('./routes/chat/listConversations')
const chatListMessages = require('./routes/chat/listMessages')

// notifications
const notifDelete = require('./routes/notification/delete')
const notifDeleteAll = require('./routes/notification/deleteAll')
const notifLike = require('./routes/notification/like')
const notifList = require('./routes/notification/list')
const notifOpened = require('./routes/notification/open')
const notifProfileView = require('./routes/notification/profileView')
const notifUnlike = require('./routes/notification/unlike')

// Initialise application
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Set auth route(s)
app.use('/auth', authToken)

app.use(authCredentials)

// Set user route(s)
app.use(
  '/user',
  userAdd,
  userAuthenticate,
  userConfirmAccount,
  userGetById
)

// Set user token route(s)
app.use(
  '/user/token',
  userTokenVerify,
  userTokenBan
)

// Set chat route(s)
app.use(
  '/chat',
  chatAddMessage,
  chatDeleteAllConversations,
  chatDeleteConversation,
  chatListConversations,
  chatListMessages
)

// Set user notification route(s)
app.use(
  '/notification',
  notifDelete,
  notifDeleteAll,
  notifLike,
  notifList,
  notifOpened,
  notifProfileView,
  notifUnlike
)

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
