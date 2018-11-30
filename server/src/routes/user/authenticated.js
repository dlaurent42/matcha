const express = require('express')
const { jwtRefreshToken } = require('../../models/auth/jwt')

const router = express.Router()

router.get('/authenticated', (req, res) => {
  console.log('Authentication ongoing...')
  jwtRefreshToken(req)
    .then(() => res.json({ isLogged: true }))
    .catch(() => res.json({ isLogged: false }))
})

module.exports = router
