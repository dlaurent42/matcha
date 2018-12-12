const express = require('express')
const JsonWebToken = require('../../../models/JsonWebToken')
const { isEmpty } = require('../../../utils')

const router = express.Router()

router.post('/ban', (req, res) => {
  if (isEmpty(req.body.token)) return res.sendStatus(403)
  const jwt = new JsonWebToken()
  return jwt.delete(req.body.token)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(403))
})

module.exports = router
