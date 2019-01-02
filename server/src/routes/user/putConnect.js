const router = require('express').Router()
const User = require('../../models/User')

router.put('/:id/connect', (req, res) => (
  new User().setConnected(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(403).send({ err: err.message }))
))

module.exports = router
