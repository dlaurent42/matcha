const express = require('express')
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/conversations', (req, res) => {
  if (isEmpty(req.query.id)) return res.status(400).send({ err: 'Missing argument.' })
  const chat = new Chat()
  return chat.listConversations(req.query.id)
    .then(conversations => res.json(conversations))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
