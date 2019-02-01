const router = require('express').Router()
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.delete('/', (req, res) => {
  if (isEmpty(req.body.token)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new JsonWebToken().delete(req.body.token)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(403))
})

module.exports = router
