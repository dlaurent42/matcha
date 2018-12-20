const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

router.get('/conversations', (req, res) => {
  if (isEmpty(req.query.user_id)) return res.status(400).send({ err: 'Missing argument.' })
  const chat = new Chat()
  return chat.listConversations(req.query.user_id)
    .then(conversations => res.json(conversations))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
