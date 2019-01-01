const dotenv = require('dotenv')

dotenv.load()

const environment = process.env.NODE_ENV || 'production'

console.log(`Server environment is ${environment}`)

const config = {
  production: {
    SERVER: {
      HOST: 'localhost',
      PORT: '8081',
    },
    DATABASE: {
      HOST: process.env.DATABASE_HOST || '127.0.0.1',
      NAME: process.env.DATABASE_NAME || 'matcha',
      USER: process.env.DATABASE_USER,
      PASS: process.env.DATABASE_PASS,
    },
    MAIL: {
      USER: process.env.MAIL_USER,
      PASS: process.env.MAIL_PASS,
    },
    JWT: {
      DURATION: '15m',
      SECRET: process.env.SECRET_KEY,
    },
  },
  development: {
    SERVER: {
      HOST: 'localhost',
      PORT: '8081',
    },
    DATABASE: {
      HOST: process.env.DATABASE_HOST || '127.0.0.1',
      NAME: process.env.DATABASE_NAME || 'matcha',
      USER: process.env.DATABASE_USER,
      PASS: process.env.DATABASE_PASS,
    },
    MAIL: {
      USER: process.env.MAIL_USER,
      PASS: process.env.MAIL_PASS,
    },
    JWT: {
      DURATION: '24h',
      SECRET: process.env.SECRET_KEY || 'ABFA422265CE21265CDECF71CD8DF',
    },
  },
  test: {
    SERVER: {
      HOST: 'localhost',
      PORT: '8081',
    },
    DATABASE: {
      HOST: process.env.DATABASE_HOST || '127.0.0.1',
      NAME: process.env.DATABASE_NAME || 'matcha_test',
      USER: process.env.DATABASE_USER,
      PASS: process.env.DATABASE_PASS,
    },
    MAIL: {
      USER: process.env.MAIL_USER,
      PASS: process.env.MAIL_PASS,
    },
    JWT: {
      DURATION: '24h',
      SECRET: process.env.SECRET_KEY || 'ABFA422265CE21265CDECF71CD8DF',
    },
  },
}

module.exports = config[environment]
