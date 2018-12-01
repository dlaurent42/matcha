const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty } = require('../utils')

class JsonWebToken {
  static refresh(req) {
    console.log('refresh json web token ...')
    const bearerHeader = req.headers.authorization
    const bearerToken = (typeof bearerHeader !== 'undefined')
      ? bearerHeader.split(' ')[1]
      : ''
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [bearerToken])
        .then((rows) => {
          if (isEmpty(rows)) {
            return jwt.verify(bearerToken, 'secretkey', (err, authData) => {
              if (err) return reject(err)
              jwt.sign({ user: authData.user }, 'secretkey', { expiresIn: '15m' })
              return resolve(authData)
            })
          }
          return reject()
        })
        .catch(err => reject(err))
    })
  }

  static create(uid) {
    console.log('create json web token ...')
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM `users` WHERE `id` = ? LIMIT 1;', uid)
        .then((rows) => {
          if (isEmpty(rows)) {
            return jwt.sign({ user: rows[0] }, 'secretkey', { expiresIn: '15m' }, (err, token) => {
              if (err) return reject(err)
              return resolve(token)
            })
          }
          return reject()
        })
        .catch(err => reject(err))
    })
  }

  static delete(req) {
    console.log('delete json web token ...')
    const bearerHeader = req.headers.authorization
    const bearerToken = (typeof bearerHeader !== 'undefined')
      ? bearerHeader.split(' ')[1]
      : ''
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('INSERT INTO `tokens_blacklist` (`token`) VALUES (?);', [bearerToken])
        .then(rows => resolve(rows))
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
