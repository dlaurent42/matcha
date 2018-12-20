const router = require('express').Router()
const { isEmpty } = require('../../../utils')

router.post('/import', (req, res) => {
  if (isEmpty(req.body.img) || isEmpty(req.body.userId)) return res.status(400).send({ err: 'Wrong arguments' })
  return res.sendStatus(200)
})

module.exports = router
