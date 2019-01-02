const router = require('express').Router()
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES
const { GET_TOKEN } = require('../../config/constants').QUERIES.AUTH

router.get('/', (req, res) => {
  // Check input
  if (isEmpty(req.body.client_id) || isEmpty(req.body.client_secret)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }

  // Instanciate objects
  const credentials = [req.body.client_id, req.body.client_secret]

  // Check in the database if credentials are correct
  return new Database().query(GET_TOKEN, credentials)
    .then((rows) => {
      if (rows[0].count === 0) {
        return res.status(401).json({ err: ERRORS.AUTH_CREDENTIALS })
      }
      return new JsonWebToken().create({ data: credentials })
    })
    .then(token => res.json({ token }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
