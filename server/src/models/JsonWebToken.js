const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty } = require('../utils')

class JsonWebToken {
  constructor() {
    this.token = ''
  }

  check(token) {
    this.token = token
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [token])
        .then((res) => {
          if (res[0].count === 0) return jwt.verify(token, 'secretkey')
          return reject()
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
    Object.assign(data, { date: Date.now() })
    return new Promise((resolve, reject) => {
      jwt.sign({ data }, 'secretkey', { expiresIn: '15m' }, (err, token) => {
        if (!isEmpty(err)) return reject(err)
        this.token = token
        return resolve(token)
      })
    })
  }

  delete(token) {
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('INSERT INTO `tokens_blacklist` (`token`) VALUES (?);', [token])
        .then(() => {
          this.token = ''
          return resolve()
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
