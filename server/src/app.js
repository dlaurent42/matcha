// NPM installed modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// Developed modules
const config = require('./config')
const authToken = require('./routes/auth/token')
const authCredentials = require('./middlewares/auth')
const userAdd = require('./routes/user/add')
const userAuthenticate = require('./routes/user/authenticate')
const userGetById = require('./routes/user/id')
const userConfirmAccount = require('./routes/user/confirmAccount')
const userNotifDelete = require('./routes/notification/delete')
const userNotifDeleteAll = require('./routes/notification/deleteAll')
const userNotifLike = require('./routes/notification/like')
const userNotifList = require('./routes/notification/list')
const userNotifMessage = require('./routes/notification/message')
const userNotifOpened = require('./routes/notification/open')
const userNotifProfileView = require('./routes/notification/profileView')
const userNotifUnlike = require('./routes/notification/unlike')
const userTokenVerify = require('./routes/user/token/verify')
const userTokenBan = require('./routes/user/token/ban')

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

// Set user notification route(s)
app.use(
  '/notification',
  userNotifDelete,
  userNotifDeleteAll,
  userNotifLike,
  userNotifList,
  userNotifMessage,
  userNotifOpened,
  userNotifProfileView,
  userNotifUnlike
)

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
