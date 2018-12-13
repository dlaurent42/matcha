const express = require('express')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.put('/viewed', (req, res) => {
  if (isEmpty(req.body.notificationId)) res.status(400).send({ err: 'Missing argument.' })
  const notification = new Notification()
  return notification.viewed(req.body.notificationId)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
