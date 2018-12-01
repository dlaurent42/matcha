// NPM installed modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// Developed modules
const config = require('./config')
const userAdd = require('./routes/user/add')
const userAuthenticate = require('./routes/user/authenticate')
const userCount = require('./routes/user/count')
const userCredentials = require('./routes/user/credentials')
const userGetById = require('./routes/user/id')
const userLogout = require('./routes/user/logout')

// Initialise application
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Set routes
app.use(
  '/user',
  userAdd,
  userAuthenticate,
  userCount,
  userCredentials,
  userGetById,
  userLogout
)

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
