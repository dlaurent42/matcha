const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty, random } = require('../utils')

class JsonWebToken {
  constructor() {
    this.token = ''
  }

  refresh(req) {
    const bearerHeader = req.headers.authorization
    const bearerToken = (typeof bearerHeader !== 'undefined')
      ? bearerHeader.split(' ')[1]
      : ''
    const database = new Database()

    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [bearerToken])
        .then((rows) => {
          if (rows[0].count === 0) return jwt.verify(bearerToken, 'secretkey')
          return reject()
        })
        .then((authData, err) => {
          if (err) return reject(err)
          this.token = bearerToken
          Object.assign(authData, { randomKey: random(255) })
          return jwt.sign({ data: authData.user }, 'secretkey', { expiresIn: '15m' })
        })
        .then((token, err) => {
          if (!isEmpty(err)) return reject(err)
          this.token = token
          return resolve(token)
        })
        .catch(err => reject(err))
    })
  }

  create(uid) {
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM `users` WHERE `id` = ? LIMIT 1;', [uid])
        .then((rows) => {
          if (!isEmpty(rows)) {
            const data = Object.assign(rows[0], { randomKey: random(255) })
            return jwt.sign({ data }, 'secretkey', { expiresIn: '15m' })
          }
          return reject()
        })
        .then((token, err) => {
          if (!isEmpty(err)) return reject(err)
          this.token = token
          return resolve(token)
        })
        .catch(err => reject(err))
    })
  }

  delete(req) {
    const bearerHeader = req.headers.authorization
    const bearerToken = (typeof bearerHeader !== 'undefined')
      ? bearerHeader.split(' ')[1]
      : ''
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('INSERT INTO `tokens_blacklist` (`token`) VALUES (?);', [bearerToken])
        .then((rows) => {
          this.token = ''
          resolve(rows)
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
