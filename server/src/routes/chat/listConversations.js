const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.get('/conversations', (req, res) => {
  if (isEmpty(req.query.user_id)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new Chat().listConversations(req.query.user_id)
    .then(conversations => res.json({ conversations }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
