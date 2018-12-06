const express = require('express')
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.post('/', (req, res) => {
  // Check input
  if (isEmpty(req.body.clientId) || isEmpty(req.body.secretId)) return res.json({ err: 'wrong credentials' })

  // Instanciate objects
  const credentials = [req.body.clientId, req.body.secretId]
  const database = new Database()
  const jwt = new JsonWebToken()

  // Check in the database if credentials are correct
  return database.query('SELECT COUNT(*) as count FROM `auth` WHERE `clientId` = ? AND `secretId` = ?;', credentials)
    .then((rows) => {
      if (isEmpty(rows)) return res.json({ err: 'wrong credentials' })
      return jwt.create(credentials)
    })
    .then(token => res.json({ token }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
