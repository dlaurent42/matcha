const router = require('express').Router()
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.get('/', (req, res) => {
  if (isEmpty(req.body.user_id)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new Notification().list(req.body.user_id)
    .then(notifications => res.json({ notifications }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
