const express = require('express')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.put('/viewed-all', (req, res) => {
  if (isEmpty(req.body.userId)) res.status(400).send({ err: 'Missing argument.' })
  const notification = new Notification()
  return notification.viewedAll(req.body.userId)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
