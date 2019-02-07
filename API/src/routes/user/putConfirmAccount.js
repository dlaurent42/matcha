const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.put('/confirm-account', (req, res) => {
  // Check if token is defined
  if (isEmpty(req.body.token)) return res.status(400).json({ err: ERRORS.DATA_MISSING })

  return new User().verifyRegistrationToken(req.body.token)
    .then(user => res.json({ user }))
    .catch(err => res.status(403).send({ err: err.message }))
})

module.exports = router
