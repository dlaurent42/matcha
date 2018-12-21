const router = require('express').Router()
const Notification = require('../../models/Notification')
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

router.post('/new-message', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver) || isEmpty(req.body.message)) res.status(400).send({ err: 'Missing argument.' })
  return new Chat().addMessage(req.body.emitter, req.body.receiver, req.body.message)
    .then(() => new Notification().message(req.body.emitter, req.body.receiver))
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
