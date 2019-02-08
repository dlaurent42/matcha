const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty, userIsPassword } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.put('/recover-password', (req, res) => {
  // Check if token is defined
  if (isEmpty(req.body.token)
  || isEmpty(req.body.new_password)
  || isEmpty(req.body.confirmed_new_password)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }

  // Check password / confirmed password
  if (!userIsPassword(req.body.new_password, req.body.confirmed_new_password)) {
    return res.status(400).json({ err: ERRORS.DATA_VALIDATION })
  }

  const userInstance = new User()
  return userInstance.verifyPasswordRecoveryToken(req.body.token)
    .then(user => userInstance.setPassword(user.id, req.body.new_password))
    .then(user => res.json({ user }))
    .catch(err => res.status(403).send({ err: err.message }))
})

module.exports = router
