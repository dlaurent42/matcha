const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.get('/message', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new Chat().listMessages(req.body.emitter, req.body.receiver)
    .then(messages => res.json({ messages }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
