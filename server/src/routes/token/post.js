const router = require('express').Router()
const JsonWebToken = require('../../models/JsonWebToken')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES
const { JWT } = require('../../config/config')

router.post('/', (req, res) => {
  if (isEmpty(req.body.data)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new JsonWebToken().create(req.body.data)
    .then((token) => {
      if (isEmpty(token)) return res.json({ err: ERRORS.GENERAL })
      return res.json({ token, expire: JWT.DURATION })
    })
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
