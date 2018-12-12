const express = require('express')
const User = require('../../models/User')

const router = express.Router()

router.get('/:id', (req, res) => {
  const user = new User()
  return user.fetchInformationById(req.params.id)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.json({ err }))
})

module.exports = router
