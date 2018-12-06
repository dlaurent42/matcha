const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty, hash } = require('../utils')

class JsonWebToken {
  constructor() {
    this.token = ''
  }

  check(token) {
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [token])
        .then((res) => {
          console.log(`JSON Web Token check: ${res}`)
          if (res[0].count === 0) return jwt.verify(token, 'secretkey')
          return reject()
        })
        .then((data) => resolve(data))
        .catch(err => reject(err))
      })  
  }

  refresh(token) {
    return new Promise((resolve, reject) => {
      this.check(token)
        .then(() => this.delete(token))
        .then(() => this.create(data))
        .then((token) => resolve(token))
        .catch(err => reject(err))
    })

  }

  create(data) {
    return new Promise((resolve, reject) => {
      jwt.sign({ data }, 'secretkey', { expiresIn: '15m' })
        .then((token, err) => {
          console.log(`JSON Web Token create: ${res}`)
          if (!isEmpty(err)) return reject(err)
          this.token = token
          return resolve(token)
        })
        .catch(err => reject(err))
    })
  }

  delete(token) {
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('INSERT INTO `tokens_blacklist` (`token`) VALUES (?);', [token])
        .then(() => {
          console.log(`JSON Web Token delete: ${res}`)
          this.token = ''
          return resolve()
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
