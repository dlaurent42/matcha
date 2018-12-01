const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty } = require('../utils')

class JsonWebToken {
  constructor() {
    this.token = ''
  }

  refresh(req) {
    console.log('refresh json web token ...')
    const bearerHeader = req.headers.authorization
    const bearerToken = (typeof bearerHeader !== 'undefined')
      ? bearerHeader.split(' ')[1]
      : ''
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [bearerToken])
        .then((rows) => {
          console.log('From refresh JSON Web Token : ', JSON.stringify(rows[0]))
          if (rows[0].count === 0) {
            console.log('Verifying token ', bearerToken)
            return jwt.verify(bearerToken, 'secretkey', (authData, err) => {
              if (err) return reject(err)
              this.token = bearerToken
              jwt.sign({ user: authData.user }, 'secretkey', { expiresIn: '15m' })
              return resolve(authData)
            })
          }
          return reject()
        })
        .catch(err => reject(err))
    })
  }

  create(uid) {
    console.log('create json web token ...')
    const database = new Database()
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM `users` WHERE `id` = ? LIMIT 1;', [uid])
        .then((rows) => {
          if (!isEmpty(rows)) {
            return jwt.sign({ user: rows[0] }, 'secretkey', { expiresIn: '15m' })
          }
          return reject()
        })
        .then((err, token) => {
          if (!isEmpty(err)) return reject(err)
          this.token = token
          return resolve(token)
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
        .then((rows) => {
          console.log('From delete JSON Web Token : ', JSON.stringify(rows))
          this.token = ''
          resolve(rows)
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = JsonWebToken
