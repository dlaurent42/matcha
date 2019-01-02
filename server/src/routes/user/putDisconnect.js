const router = require('express').Router()
const User = require('../../models/User')

router.put('/:id/disconnect', (req, res) => (
  new User().setDisconnected(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(403).send({ err: err.message }))
))

module.exports = router
