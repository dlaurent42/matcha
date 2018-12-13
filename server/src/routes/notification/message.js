const express = require('express')
const User = require('../../models/User')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.post('/like', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver) || isEmpty(req.body.message)) res.status(400).send({ err: 'Missing argument.' })
  const user = new User()
  const notification = new Notification()
  return user.addMessage(req.body.emitter, req.body.receiver, req.body.message)
    .then(() => notification.message(req.body.emitter, req.body.receiver))
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
