const router = require('express').Router()
const Interest = require('../../models/Interest')

router.get('/', (req, res) => (
  new Interest().list()
    .then(tags => res.json({ tags }))
    .catch(err => res.json({ err: err.message }))
))

module.exports = router
