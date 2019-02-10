const router = require('express').Router()
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')
const { JWT } = require('../../config/config')
const { ERRORS } = require('../../config/constants').RESPONSES
const { GET_TOKEN } = require('../../config/constants').QUERIES.AUTH

router.get('/', (req, res) => {
  // Check input
  if (isEmpty(req.query.client_id) || isEmpty(req.query.client_secret)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }

  // Instanciate objects
  const credentials = [req.query.client_id, req.query.client_secret]

  // Check in the database if credentials are correct
  return new Database().query(GET_TOKEN, credentials)
    .then((rows) => {
      if (rows[0].count === 0) {
        return res.status(401).json({ err: ERRORS.AUTH_CREDENTIALS })
      }
      return new JsonWebToken().create({ data: credentials })
    })
    .then(token => res.json({ token, createdAt: Date.now(), expireAt: Date.now() + JWT.DURATION * 1000 }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
