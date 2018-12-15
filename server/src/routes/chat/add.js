const express = require('express')
const Notification = require('../../models/Notification')
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.post('/new-message', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver) || isEmpty(req.body.message)) res.status(400).send({ err: 'Missing argument.' })
  const chat = new Chat()
  const notification = new Notification()
  return chat.addMessage(req.body.emitter, req.body.receiver, req.body.message)
    .then(() => notification.message(req.body.emitter, req.body.receiver))
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
