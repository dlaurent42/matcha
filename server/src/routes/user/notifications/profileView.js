const express = require('express')
const User = require('../../../models/User')
const { isEmpty } = require('../../../utils')

const router = express.Router()

router.post('/see-profile', (req, res) => {
  if (isEmpty(req.body.emitter) || isEmpty(req.body.receiver)) res.status(400).send({ err: 'Missing argument.' })
  const user = new User()
  return user.notifyNewView(req.body.emitter, req.body.receiver)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
