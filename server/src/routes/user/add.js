const router = require('express').Router()
const User = require('../../models/User')
const {
  isEmpty,
  userIsFirstname,
  userIsLastname,
  userIsUsername,
  userIsEmail,
  userIsPassword,
} = require('../../utils')

const dataCheck = user => (
  userIsFirstname(user.firstname)
  && userIsLastname(user.lastname)
  && userIsUsername(user.username)
  && userIsEmail(user.email)
  && userIsPassword(user.password, user.cpassword)
)

router.post('/add', (req, res) => {
  // Check if user is not undefined
  if (isEmpty(req.body.user) || isEmpty(req.body.redirect_uri)) return res.status(400).send({ err: 'Missing argument.' })

  const userInput = Object.assign(req.body.user)

  // Check user data
  if (!dataCheck(userInput)) return res.status(401).send({ err: 'Wrong input.' })

  const user = new User()
  return user.add(userInput, req.body.redirect_uri)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
