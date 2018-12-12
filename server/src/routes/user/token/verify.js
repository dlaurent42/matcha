const express = require('express')
const User = require('../../../models/User')
const { isEmpty } = require('../../../utils')

const router = express.Router()

router.post('/verify', (req, res) => {
  const user = new User()
  if (isEmpty(req.body.token)) return res.sendStatus(403)
  return user.verifyToken(req.body.token)
    .then(userData => res.json({ userData }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
