// NPM installed modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// Developed modules
const config = require('./config')
const userAdd = require('./routes/user/add')
const userAuthenticate = require('./routes/user/authenticate')
const userAuthenticated = require('./routes/user/authenticated')
const userCount = require('./routes/user/count')

// Initialise application
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Set routes
app.use('/user', userAdd, userAuthenticate, userAuthenticated, userCount)

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
