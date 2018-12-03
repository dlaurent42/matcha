const express = require('express')
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const Mail = require('../../models/Mail')
const {
  hash,
  isEmpty,
  isAlpha,
  isAlphaNumeric,
  isEmail,
  hasDigit,
  hasLowercase,
  hasUppercase,
  hasSpecial,
} = require('../../utils')

const router = express.Router()

router.post('/add', (req, res) => {
  // Check if user is not undefined
  if (isEmpty(req.body.user)) return res.json({ err: 'Please fill the form' })

  const user = Object.assign(req.body.user)
  const database = new Database()
  const jwt = new JsonWebToken()
  const mail = new Mail()

  // Check username
  if (isEmpty(user.username)) return res.json({ err: 'Please enter a username' })
  if (user.username.length < 5 || user.username.length > 25) return res.json({ err: 'Username must contains between 5 and 25 characters' })
  if (!isAlphaNumeric(user.username)) return res.json({ err: 'Username must contains only letters and numbers' })

  // Check if firstname
  if (isEmpty(user.firstname)) return res.json({ err: 'Please enter a firstname' })
  if (user.firstname.length < 5 || user.firstname.length > 25) return res.json({ err: 'Firstname must contains between 5 and 25 characters' })
  if (!isAlpha(user.firstname)) return res.json({ err: 'Firstname must contains only letters' })

  // Check if lastname
  if (isEmpty(user.lastname)) return res.json({ err: 'Please enter a lastname' })
  if (user.lastname.length < 5 || user.lastname.length > 25) return res.json({ err: 'Lastname must contains between 5 and 25 characters' })
  if (!isAlpha(user.lastname)) return res.json({ err: 'Lastname must contains only letters' })

  // Check if email
  if (isEmpty(user.email)) return res.json({ err: 'Please enter an email address' })
  if (!isEmail(user.email)) return res.json({ err: 'Please enter a valid email address' })
  if (user.email.length > 254) return res.json({ err: 'Email must contains at most 254 characters' })

  // Check if password
  if (isEmpty(user.password)) return res.json({ err: 'Please enter a password' })
  if (user.password.length < 8) return res.json({ err: 'Password must contains at least 8 characters' })
  if (!(hasDigit(user.password)
  && hasSpecial(user.password)
  && hasLowercase(user.password)
  && hasUppercase(user.password))) return res.json({ err: 'Password must contains at least a digit, an uppercase letter, a lowercase letter and a special character' })

  // Check if cpassword
  if (isEmpty(user.cpassword)) return res.json({ err: 'Please confirm your password' })
  if (user.password !== user.cpassword) return res.json({ err: 'Confirmed password is different from entered password' })

  // Query database to know if user already exists (based on username and email)
  return database.query('SELECT COUNT(*) AS count FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;', [user.username, user.email])
    .then((rows) => {
      if (rows[0].count > 0) throw new Error('An account with entered email/username already exists')
      Object.assign(user, { salt: hash.genRandomString(255) })
      user.password = hash.sha512(user.password, user.salt)
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
      Object.assign(user, { regToken: hash.genRandomString(255), id: rows.insertId })
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
      return jwt.create(user.id)
    })
    .then((token) => {
      Object.assign(user, { logToken: token })
      return mail.registration(user)
    })
    .then(() => res.json({ token: user.logToken, isLogged: true }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
