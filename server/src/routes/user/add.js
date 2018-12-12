const express = require('express')
const User = require('../../models/User')
const {
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
  if (isEmpty(req.body.user)) return res.json({ err: 'Please fill the form.' })

  const userInput = Object.assign(req.body.user)

  // Check user data
  if (!dataCheck(userInput)) return res.json({ err: 'Data validation failed.' })

  const user = new User()
  return user.add(userInput)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.json({ err }))
})

module.exports = router
