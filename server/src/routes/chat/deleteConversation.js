const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

router.delete('/delete-conversation', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) res.status(400).send({ err: 'Missing argument.' })
  const chat = new Chat()
  return chat.deleteConversation(req.body.emitter, req.body.receiver)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
