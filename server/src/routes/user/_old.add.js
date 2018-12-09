const express = require('express')
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const Mail = require('../../models/Mail')
const {
  hash,
  random,
  isEmpty,
  userIsFirstname,
  userIsLastname,
  userIsUsername,
  userIsEmail,
  userIsPassword,
} = require('../../utils')

const router = express.Router()

const dataCheck = user => (
  userIsFirstname(user.firstname)
  && userIsLastname(user.lastname)
  && userIsUsername(user.username)
  && userIsEmail(user.email)
  && userIsPassword(user.password, user.cpassword)
)

router.post('/add', (req, res) => {
  // Check if user is not undefined
  if (isEmpty(req.body.user)) return res.json({ err: 'Please fill the form' })

  const user = Object.assign(req.body.user)
  const database = new Database()
  const jwt = new JsonWebToken()
  const mail = new Mail()

  // Check user data
  if (!dataCheck(user)) return res.json({ err: 'Data validation failded' })

  // Query database to know if user already exists (based on username and email)
  return database.query('SELECT COUNT(*) AS count FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;', [user.username, user.email])
    .then((rows) => {
      if (rows[0].count > 0) throw new Error('An account with entered email/username already exists')
      Object.assign(user, { salt: random(255) })
      user.password = hash(user.password, user.salt)
      user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)
      user.lastname = user.lastname.toUpperCase()
      return (database.query(
        'INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`, `password`, `salt`) VALUES (?, ?, ?, ?, ?, ?);',
        [
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          user.password,
          user.salt,
        ]
      ))
    })
    .then((rows) => {
      if (isEmpty(rows)) throw new Error('An error occured. Please try again later.')
      Object.assign(user, { regToken: random(255), id: rows.insertId })
      return (database.query(
        'INSERT INTO `users_registration` (`token`, `user_id`, `expiration_date`) VALUES (?, ?, NOW() + INTERVAL 1 DAY);',
        [
          user.regToken,
          user.id,
        ]
      ))
    })
    .then((rows) => {
      if (isEmpty(rows)) return res.json({ err: 'An error occured.' })
      database.close()
      return jwt.create(user)
    })
    .then((token) => {
      Object.assign(user, { logToken: token })
      return mail.registration(user)
    })
    .then(() => res.json({ token: user.logToken, isLogged: true }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
