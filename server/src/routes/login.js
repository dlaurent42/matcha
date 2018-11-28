const express = require('express')
const login = require('../models/user/login')
const { jwtNewToken, jwtRefreshToken } = require('../models/auth/jwt')

const router = express.Router()

router.post('/login', (req, res) => {
  try {
    login(req.body.user)
      .then(rows => jwtNewToken(rows.id))
      .then(token => res.json({ token }))
      .catch(err => res.json({ err, message: 'Error rejected' }))
  } catch (err) {
    res.json({ err: err.message })
  }
})

router.get('/login', (req, res) => {
  jwtRefreshToken(req)
    .then(() => res.redirect('/'))
    .catch(() => res.sendStatus(200))
})

module.exports = router
