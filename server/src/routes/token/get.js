const router = require('express').Router()
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.get('/', (req, res) => {
  if (isEmpty(req.query.token)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new JsonWebToken().check(req.query.token)
    .then(data => res.json(data))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
