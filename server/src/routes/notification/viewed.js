const router = require('express').Router()
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

router.put('/viewed', (req, res) => {
  if (isEmpty(req.body.notification_id)) res.status(400).send({ err: 'Missing argument.' })
  const notification = new Notification()
  return notification.viewed(req.body.notification_id)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
