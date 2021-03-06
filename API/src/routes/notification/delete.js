const router = require('express').Router()
const Notification = require('../../models/Notification')
const { isEmpty, isNumeric } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.delete('/:notification_id', (req, res) => {
  if (isEmpty(req.params.notification_id)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  if (!isNumeric(req.params.notification_id) && parseInt(req.params.notification_id, 10) > 0) {
    return res.sendStatus(404)
  }
  return new Notification().delete(req.params.notification_id)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
