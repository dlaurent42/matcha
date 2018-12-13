const express = require('express')
const Notification = require('../../models/Notification')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.delete('/delete-all', (req, res) => {
  if (isEmpty(req.body.userId)) return res.status(400).send({ err: 'Missing argument.' })
  const notification = new Notification()
  return notification.deleteAll(req.body.userId)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
