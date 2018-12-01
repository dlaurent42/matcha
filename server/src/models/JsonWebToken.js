const jwt = require('jsonwebtoken')
const Database = require('./Database')
const { isEmpty, hash } = require('../utils')

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
    console.log('refresh json web token ...', JSON.stringify(req.headers.authorization))
    return new Promise((resolve, reject) => {
      database.query('SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;', [bearerToken])
        .then((rows) => {
          console.log('From refresh JSON Web Token : ', JSON.stringify(rows[0]))
          if (rows[0].count === 0) {
            console.log('Verifying token ', bearerToken)
            return jwt.verify(bearerToken, 'secretkey')
          }
          return reject()
        })
        .then((authData, err) => {
          if (err) return reject(err)
          this.token = bearerToken
          authData.push(hash.genRandomString(255))
          console.log('Auth data : ', JSON.stringify(authData))
          return jwt.sign({ data: authData.user }, 'secretkey', { expiresIn: '15m' })
        })
        .then((token, err) => {
          console.log('getting token with err ', err, ' token ', token)
          if (!isEmpty(err)) return reject(err)
          this.token = token
          return resolve(token)
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
          console.log('getting user', JSON.stringify(rows))
          if (!isEmpty(rows)) {
            const data = Object.assign(rows[0], hash.genRandomString(255))
            return jwt.sign({ data }, 'secretkey', { expiresIn: '15m' })
          }
          return reject()
        })
        .then((token, err) => {
          console.log('getting token with err ', err, ' token ', token)
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
    console.log('delete json web token ...', bearerToken)
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
