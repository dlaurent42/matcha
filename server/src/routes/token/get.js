const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.get('/', (req, res) => {
  if (isEmpty(req.body.token)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new User().verifyIdentifiationToken(req.body.token)
    .then(user => res.json({ user }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
