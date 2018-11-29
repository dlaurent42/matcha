const express = require('express')
const { jwtRefreshToken } = require('../models/auth/jwt')

const router = express.Router()

router.get('/', (req, res) => {
  jwtRefreshToken(req)
    .then((authData) => {
      res.json({
        isLogged: true,
        authData,
      })
    })
    .catch(err => res.json({
      isLogged: false,
      err,
    }))
})

module.exports = router
