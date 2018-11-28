// NPM installed modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// Developed modules
const config = require('./config')
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const postsRouter = require('./routes/posts')
const registerRouter = require('./routes/register')

// Initialise application
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Set routes
app.use('/', indexRouter, loginRouter, registerRouter)
app.use('/posts', postsRouter)

app.listen(config.port, () => console.log(`Server started and listening on port ${config.port}`))
