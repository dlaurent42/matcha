const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty, userIsEmail } = require('../../utils')

router.post('/recover-password-query', (req, res) => {
  if (isEmpty(req.body.email) || isEmpty(req.body.redirect_uri)) return res.status(400).send({ err: 'Missing argument.' })

  if (!userIsEmail(req.body.email)) return res.status(401).send({ err: 'Wrong input.' })

  return new User().addRecoverPasswordToken(req.body.email, req.body.redirect_uri)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
