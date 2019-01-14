const router = require('express').Router()
const Database = require('../../models/Database')
const { isEmpty, random } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES
const { ADD_CREDENTIALS } = require('../../config/constants').QUERIES.AUTH

router.post('/', (req, res) => {
  console.log('In route', req.body.user_id)
  if (isEmpty(req.body.user_id)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  const clientId = random(64).toUpperCase()
  const clientSecret = random(64).toUpperCase()
  return (new Database().query(ADD_CREDENTIALS, [req.body.user_id, clientId, clientSecret]))
    .then(() => res.json({ clientId, clientSecret }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
