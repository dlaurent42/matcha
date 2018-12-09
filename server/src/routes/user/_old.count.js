const express = require('express')
const Database = require('../../models/Database')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/count', (req, res) => {
  const database = new Database()

  return database.query('SELECT COUNT(*) AS count FROM `users`;')
    .then((rows) => {
      if (isEmpty(rows)) res.json({ userCount: 0 })
      else res.json({ userCount: rows[0].count })
    })
    .catch(() => res.json({ userCount: 0 }))
})

module.exports = router
