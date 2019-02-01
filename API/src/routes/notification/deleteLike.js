const router = require('express').Router()
const User = require('../../models/User')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.delete('/like', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new User().deleteLike(req.body.emitter, req.body.receiver)
    .then(() => new Notification().unlike(req.body.emitter, req.body.receiver))
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
