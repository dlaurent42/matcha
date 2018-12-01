const express = require('express')
const JsonWebToken = require('../../models/JsonWebToken')

const router = express.Router()

router.get('/credentials', (req, res) => {
  const jwt = new JsonWebToken()

  console.log('Authentication ongoing...')
  jwt.refresh(req)
    .then(() => res.json({ isLogged: true }))
    .catch(() => res.json({ isLogged: false }))
})

module.exports = router
