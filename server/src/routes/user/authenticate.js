const express = require('express')
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const {
  hash,
  isEmpty,
} = require('../../utils')

const router = express.Router()

router.post('/authenticate', (req, res) => {
  // Check input
  if (isEmpty(req.body.user)) return res.json({ err: 'Please fill the form' })

  const user = Object.assign(req.body.user)
  const database = new Database()
  const jwt = new JsonWebToken()

  // Check if username has been filled in
  if (isEmpty(user.username)) return res.json({ err: 'Please enter your username' })

  // Check if password has been filled in
  if (isEmpty(user.password)) return res.json({ err: 'Please enter your password' })

  // Get salt string from username
  return database.query('SELECT `salt` FROM `users` WHERE `username` = ? LIMIT 1;', [user.username])
    .then((rows) => {
      console.log('Get salt : ', JSON.stringify(rows[0]))
      if (isEmpty(rows)) return res.json({ err: 'Wrong username or password' })
      const hashedPassword = hash.sha512(user.password, rows[0].salt)
      return database.query('SELECT * FROM `users` WHERE `username` = ? AND `password` = ? LIMIT 1;', [user.username, hashedPassword])
    })
    .then((rows) => {
      console.log('Get uid : ', JSON.stringify(rows[0]))
      if (isEmpty(rows)) return res.json({ err: 'Wrong username or password' })
      database.close()
      return jwt.create(rows[0].id)
    })
    .then((token) => {
      console.log('Authentication token : ', token)
      return res.json({ token })
    })
    .catch((err) => {
      console.log('Authentication error : ', err)
      res.json({ err: 'Wrong username or password' })
    })
})

module.exports = router
