const JsonWebToken = require('./../models/JsonWebToken')
const { isEmpty } = require('../utils')

const authCredentials = (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (isEmpty(bearerHeader)) return res.sendStatus(403)
  const jwt = new JsonWebToken()
  const bearerToken = bearerHeader.split(' ')[1]
  console.log(`\nRoute: ${req.url}\n`)
  return jwt.check(bearerToken)
    .then((data) => {
      if (isEmpty(data)) return res.sendStatus(403)
      return next()
    })
    .catch(() => res.sendStatus(403))
}

module.exports = authCredentials
