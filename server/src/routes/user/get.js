const router = require('express').Router()
const User = require('../../models/User')
const { isNumeric } = require('../../utils')

router.get('/:id', (req, res) => {
  if (!isNumeric(req.params.id)) return res.sendStatus(404)
  return new User().fetchInformationById(req.params.id)
    .then(user => res.json({ user }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
