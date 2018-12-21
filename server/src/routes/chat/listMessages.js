const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')

router.get('/messages', (req, res) => {
  if (isEmpty(req.query.emitter) || isEmpty(req.query.receiver)) return res.status(400).send({ err: 'Missing argument.' })
  return new Chat().listMessages(req.query.emitter, req.query.receiver)
    .then(messages => res.json(messages))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
