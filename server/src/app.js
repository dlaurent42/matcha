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
const userTokenVerify = require('./routes/user.token/verify')
const userTokenBan = require('./routes/user.token/ban')

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

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
