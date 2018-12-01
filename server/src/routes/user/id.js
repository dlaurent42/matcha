const express = require('express')
const Database = require('../../models/Database')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/:id', (req, res) => {
  const database = new Database()

  return database.query('SELECT * FROM `users` WHERE `id` = ?;', req.originalUrl)
    .then((rows) => {
      if (isEmpty(rows)) res.json({ err: 'no user found' })
      else res.json({ rows })
    })
    .catch((err) => {
      res.json({ err })
    })
})

module.exports = router
