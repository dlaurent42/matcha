const router = require('express').Router()
const User = require('../../models/User')

router.get('/:id', (req, res) => (
  new User().fetchInformationById(req.params.id)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.json({ err: err.message }))
))

module.exports = router
