const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty } = require('../utils')
const { JWT } = require('../config/config')
const { JSON_WEB_TOKEN } = require('../config/constants').QUERIES
const { ERRORS } = require('../config/constants').RESPONSES

class JsonWebToken {
  constructor() {
    this.token = ''
  }

  check(token) {
    this.token = token
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query(JSON_WEB_TOKEN.GET, [token])
        .then((res) => {
          if (res[0].count === 0) return jwt.verify(token, JWT.SECRET)
          return reject(new Error(ERRORS.JWT_TOKEN_IN_BLACKLIST))
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }

  refresh(token) {
    let data
    return new Promise((resolve, reject) => {
      this.check(token)
        .then((tokenData) => {
          data = tokenData
          this.delete(token)
        })
        .then(() => this.create(data))
        .then(() => resolve(this.token))
        .catch(err => reject(err))
    })
  }

  create(data) {
    return new Promise((resolve, reject) => {
      jwt.sign(data, JWT.SECRET, { expiresIn: JWT.DURATION }, (err, token) => {
        if (!isEmpty(err)) return reject(err)
        this.token = token
        return resolve(token)
      })
    })
  }

  delete(token) {
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query(JSON_WEB_TOKEN.ADD_BLACKLIST, [token])
        .then(() => {
          this.token = ''
          return resolve()
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
