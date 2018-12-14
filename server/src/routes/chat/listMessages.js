const express = require('express')
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/messages', (req, res) => {
  if (isEmpty(req.query.emitter) || isEmpty(req.query.receiver)) return res.status(400).send({ err: 'Missing argument.' })
  const chat = new Chat()
  return chat.listMessages(req.query.emitter, req.query.receiver)
    .then(messages => res.json(messages))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
