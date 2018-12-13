const express = require('express')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/', (req, res) => {
  if (isEmpty(req.query.userId)) return res.status(400).send({ err: 'Missing argument.' })
  const notification = new Notification()
  return notification.list(req.query.userId)
    .then(notifications => res.json({ notifications }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
