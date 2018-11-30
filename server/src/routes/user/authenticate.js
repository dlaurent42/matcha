const express = require('express')
const { jwtNewToken } = require('../../models/auth/jwt')
const Database = require('../../models/Database')
const {
  hash,
  isEmpty,
} = require('../../utils')

const router = express.Router()

router.post('/authenticate', (req, res) => {
 
  // Check input
  if (isEmpty(req.body.user)) return res.json({ err: 'Please fill the form' })
  
  const user = req.body.user
  const database = new Database()

  // Check if username has been filled in
  if (isEmpty(user.username)) return res.json({ err: 'Please enter your username' })

  // Check if password has been filled in
  if (isEmpty(user.password)) return res.json({ err: 'Please enter your password' })

  // Get salt string from username
  database.query('SELECT `salt` FROM `users` WHERE `username` = ? LIMIT 1;', { username: user.username })
    .then((rows) => {
      if (isEmpty(rows)) return res.json({ err: 'Wrong username or password' })
      const hashedPassword = hash.sha512(user.password, rows[0].salt)
      return database.query('SELECT * FROM `users` WHERE `username` = ? AND `password` = ? LIMIT 1;', { username: user.username, hashedPassword })
    })
    .then((rows) => {
      if (isEmpty(rows)) return res.json({ err: 'Wrong username or password' })
      database.close()
      return jwtNewToken(rows[0].id)
    })
    .then(token => res.json({ token }))
    .catch(err => res.json({ err: 'Wrong username or password' }))
})

module.exports = router
