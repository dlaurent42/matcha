const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.post('/email-confirmation', (req, res) => {
  if (isEmpty(req.body.email) || isEmpty(req.body.redirect_uri)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }
  return new User().addConfirmEmailToken(req.body.email, req.body.redirect_uri)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
