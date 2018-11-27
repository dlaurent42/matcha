const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the homepage',
  })
})

module.exports = router
