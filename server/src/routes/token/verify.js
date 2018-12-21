const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')

router.get('/verify', (req, res) => {
  if (isEmpty(req.query.token)) return res.sendStatus(403)
  return new User().verifyIdentifiationToken(req.query.token)
    .then(user => res.json({ user }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
