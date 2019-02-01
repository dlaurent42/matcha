const router = require('express').Router()
const Database = require('../../models/Database')
const { GET_CREDENTIALS } = require('../../config/constants').QUERIES.AUTH

router.get('/:id', (req, res) => (
  new Database().query(GET_CREDENTIALS, [req.params.id])
    .then((rows) => {
      const credentials = []
      rows.forEach((row) => {
        credentials.push({ client_id: row.client_id, client_secret: row.client_secret })
      })
      return res.json({ credentials })
    })
    .catch(err => res.json({ err: err.message }))
))

module.exports = router
