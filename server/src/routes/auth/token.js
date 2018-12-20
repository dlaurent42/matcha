const router = require('express').Router()
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')

router.post('/', (req, res) => {
  // Check input
  if (isEmpty(req.body.client_id) || isEmpty(req.body.client_secret)) return res.sendStatus(400)

  // Instanciate objects
  const credentials = [req.body.client_id, req.body.client_secret]
  const database = new Database()
  const jwt = new JsonWebToken()

  // Check in the database if credentials are correct
  return database.query('SELECT COUNT(*) as count FROM `auth` WHERE `clientId` = ? AND `clientSecret` = ?;', credentials)
    .then((rows) => {
      if (isEmpty(rows)) return res.sendStatus(401)
      return jwt.create({ data: credentials })
    })
    .then(token => res.json({ token }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
