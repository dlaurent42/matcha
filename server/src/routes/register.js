const express = require('express')
const register = require('../models/user/register')
const { jwtNewToken, jwtRefreshToken } = require('../models/auth/jwt')

const router = express.Router()

router.post('/register', (req, res) => {
  try {
    register(req.body.user)
      .then(rows => jwtNewToken(rows.id))
      .then(token => res.json({ token }))
      .catch(err => res.json({ err, message: 'Error rejected' }))
  } catch (err) {
    res.json({ err: err.message })
  }
})

router.get('/register', (req, res) => {
  jwtRefreshToken(req)
    .then(() => res.redirect('/'))
    .catch(() => res.sendStatus(200))
})

module.exports = router
