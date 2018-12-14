const express = require('express')

const router = express.Router()

router.put('/set-as-profile-picture', (req, res) => {
  res.sendStatus(200)
})

module.exports = router
