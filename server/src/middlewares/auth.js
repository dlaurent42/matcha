const JsonWebToken = require('./../models/JsonWebToken')
const { isEmpty } = require('../utils')

const authCredentials = (req, res, next) => {
  console.log(req.originalUrl)
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader === 'undefined') return res.sendStatus(403)
  const jwt = new JsonWebToken()
  const bearerToken = bearerHeader.split(' ')[1]
  return jwt.refresh(bearerToken)
    .then((token) => {
      if (isEmpty(token)) return res.sendStatus(403)
      return next()
    })
    .catch(() => res.sendStatus(403))
}

module.exports = authCredentials
