const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')

router.post('/block', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) res.status(400).send({ err: 'Missing argument.' })
  return new User().addBlock(req.body.emitter, req.body.receiver)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
