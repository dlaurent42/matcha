const router = require('express').Router()
const User = require('../../models/User')

router.get('/genders', (req, res) => (
  new User().fetchGenders()
    .then(genders => res.json({ genders }))
    .catch(err => res.json({ err: err.message }))
))

module.exports = router
