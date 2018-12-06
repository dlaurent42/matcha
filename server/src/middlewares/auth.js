const JsonWebToken = require('./../models/JsonWebToken')
const { isEmpty } = require('../utils')

const authCredentials = (req, res, next) => {

  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader === 'undefined') {
    return res.status(403).send({ auth: false, err: 'No token provided.' })
  } else {
    const jwt = new JsonWebToken()
    const bearerToken = bearerHeader.split(' ')[1]
    jwt.refresh(bearerToken)
      .then((token) => {
        console.log(`Middleware auth check: ${token}`)
        if (isEmpty(token)) return res.status(403).send({ auth: false, err: 'Wrong token provided.' })
        else next()
      })
      .catch(() => res.status(403).send({ auth: false, err: 'An error occured.' }))
  }
}

module.exports = authCredentials
