const router = require('express').Router()
const User = require('../../models/User')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.post('/profile', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new User().addProfileView(req.body.receiver)
    .then(() => new Notification().profileView(req.body.emitter, req.body.receiver))
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
