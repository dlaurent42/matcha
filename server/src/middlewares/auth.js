const JsonWebToken = require('./../models/JsonWebToken')
const { isEmpty } = require('../utils')

const authCredentials = (req, res, next) => {
  console.log(req.originalUrl)
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader === 'undefined') {
    return res.status(403).send({ err: 'No token provided.' })
  }
  const jwt = new JsonWebToken()
  const bearerToken = bearerHeader.split(' ')[1]
  return jwt.refresh(bearerToken)
    .then((token) => {
      if (isEmpty(token)) return res.status(403).send({ err: 'Wrong token provided.' })
      return next()
    })
    .catch(() => res.status(403).send({ err: 'An error occured.' }))
}

module.exports = authCredentials
