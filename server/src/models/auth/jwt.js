const jwt = require('jsonwebtoken')

const jwtRefreshToken = (req) => {
  const bearerHeader = req.headers.authorization

  const bearerToken = (typeof bearerHeader !== 'undefined')
    ? bearerHeader.split(' ')[1]
    : ''
  return new Promise((resolve, reject) => {
    jwt.verify(bearerToken, 'secretkey', (err, authData) => {
      if (err) return reject(err)
      jwt.sign({ user: authData.user }, 'secretkey', { expiresIn: '15m' })
      return resolve(authData)
    })
  })
}

const jwtNewToken = (uid) => {
  // Mock user -> call database
  console.log(uid)
  const user = {
    id: 1,
    username: 'username',
    email: 'email@gmail.com',
  }

  return new Promise((resolve, reject) => {
    jwt.sign({ user }, 'secretkey', { expiresIn: '15m' }, (err, token) => {
      if (err) return reject(err)
      return resolve(token)
    })
  })
}

module.exports = { jwtRefreshToken, jwtNewToken }
