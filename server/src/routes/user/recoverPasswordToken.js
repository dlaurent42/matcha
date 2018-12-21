const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')

router.get('/recover-password-check', (req, res) => {
  // Check if token is defined
  if (isEmpty(req.query.token)) return res.status(400).send({ err: 'Missing argument.' })
  return new User().verifyPasswordRecoveryToken(req.query.token)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.status(403).send({ err: err.message }))
})

module.exports = router
