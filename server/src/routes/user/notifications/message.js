const express = require('express')
const User = require('../../../models/User')
const { isEmpty } = require('../../../utils')

const router = express.Router()

router.post('/message', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver) || isEmpty(req.body.content)) res.status(400).send({ err: 'Missing argument.' })
  const user = new User()
  return user.notifyMessage(req.body.emitter, req.body.receiver, req.body.content)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
