const express = require('express')
const JsonWebToken = require('../../models/JsonWebToken')

const router = express.Router()

router.post('/logout', (req, res) => {
  const jwt = new JsonWebToken()

  console.log('Logout ongoing...')
  jwt.delete(req)
    .then(() => res.json({ isLogged: false }))
    .catch(() => res.json({ isLogged: true }))
})

module.exports = router
