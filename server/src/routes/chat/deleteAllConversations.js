const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

router.delete('/delete-all-conversations', (req, res) => {
  if (isEmpty(req.body.emitter)) res.status(400).send({ err: 'Missing argument.' })
  return new Chat().deleteAllConversations(req.body.emitter)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})


module.exports = router
