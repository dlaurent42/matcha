const router = require('express').Router()
const User = require('../../models/User')
const { isNumeric } = require('../../utils')

router.delete('/:id', (req, res) => {
  if (!isNumeric(req.params.id)) return res.sendStatus(404)
  return new User().delete(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
