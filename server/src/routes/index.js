const express = require('express')
const { jwtRefreshToken } = require('../models/auth/jwt')

const router = express.Router()

router.get('/', (req, res) => {
  jwtRefreshToken(req)
    .then((authData) => {
      res.json({
        message: 'Post created...',
        authData,
      })
    })
    .catch(err => res.json({ err }))
})

module.exports = router
