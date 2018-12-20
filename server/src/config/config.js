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
      HOST: '127.0.0.1',
      NAME: 'matcha',
      USER: 'root',
      PASS: 'password',
    },
    MAIL: {
      USER: 'donotreply.matcha@gmail.com',
      PASS: 'm4tch4.S3cur3`P4ssw0rd/*',
    },
  },
  development: {
    SERVER: {
      HOST: 'localhost',
      PORT: '8081',
    },
    DATABASE: {
      HOST: '127.0.0.1',
      NAME: 'matcha',
      USER: 'root',
      PASS: 'password',
    },
    MAIL: {
      USER: 'donotreply.matcha@gmail.com',
      PASS: 'm4tch4.S3cur3`P4ssw0rd/*',
    },
  },
  test: {
    SERVER: {
      HOST: 'localhost',
      PORT: '8081',
    },
    DATABASE: {
      HOST: '127.0.0.1',
      NAME: 'matcha_test',
      USER: 'root',
      PASS: 'password',
    },
    MAIL: {
      USER: 'donotreply.matcha@gmail.com',
      PASS: 'm4tch4.S3cur3`P4ssw0rd/*',
    },
  },
}

module.exports = config[environment]
