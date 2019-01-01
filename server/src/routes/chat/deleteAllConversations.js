const router = require('express').Router()
const Chat = require('../../models/Chat')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.delete('/delete-all-conversations', (req, res) => {
  if (isEmpty(req.body.emitter)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new Chat().deleteAllConversations(req.body.emitter)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})


module.exports = router
