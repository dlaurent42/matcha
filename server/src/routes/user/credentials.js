const express = require('express')
const JsonWebToken = require('../../models/JsonWebToken')

const router = express.Router()

router.get('/credentials', (req, res) => {
  const jwt = new JsonWebToken()

  console.log('Authentication ongoing...')
  jwt.refresh(req)
    .then(token => res.json({ token, isLogged: true }))
    .catch(err => res.json({ err, isLogged: false }))
})

module.exports = router
