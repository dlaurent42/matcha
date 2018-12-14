const express = require('express')
const { isEmpty } = require('../../../utils')

const router = express.Router()

router.post('/import', (req, res) => {
  if (isEmpty(req.body.img) || isEmpty(req.body.userId)) return res.status(400).send({ err: 'Wrong arguments' })
  return res.sendStatus(200)
})

module.exports = router
