const express = require('express')
const login = require('../models/user/login')
const { jwtNewToken } = require('../models/auth/jwt')

const router = express.Router()

router.post('/', (req, res) => {
  try {
    login(req.body.user)
      .then(rows => jwtNewToken(rows.id))
      .then(token => res.json({ token }))
      .catch(err => res.json({ err, message: 'Error rejected' }))
  } catch (err) {
    res.json({ err: err.message })
  }
})

module.exports = router
