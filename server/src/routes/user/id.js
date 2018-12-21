const router = require('express').Router()
const User = require('../../models/User')

router.get('/:id', (req, res) => (
  new User().fetchInformationById(req.params.id)
    .then(user => res.json({ user }))
    .catch(err => res.json({ err: err.message }))
))

module.exports = router
