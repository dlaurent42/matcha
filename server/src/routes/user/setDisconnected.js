const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils/')

router.put('/disconnect', (req, res) => {
  if (isEmpty(req.body.user_id)) return res.status(400).send({ err: 'Missing argument.' })
  return new User().setDisconnected(req.body.user_id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(403).send({ err: err.message }))
})

module.exports = router
