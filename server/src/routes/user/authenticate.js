const express = require('express')
const User = require('../../models/User')
const {
  isEmpty,
  userIsUsername,
  userIsPassword,
} = require('../../utils')

const router = express.Router()

const dataCheck = user => (
  userIsUsername(user.username)
  && userIsPassword(user.password)
)

router.post('/authenticate', (req, res) => {
  // Check input
  if (isEmpty(req.body.user)) return res.sendStatus(401)

  const userInput = Object.assign(req.body.user)
  const user = new User()

  // Check user data
  if (!dataCheck(userInput)) return res.sendStatus(401)

  return user.fetchInformationByUsernameAndPassword(userInput.username, userInput.password)
    .then(userData => res.json({ user: userData }))
    .catch(err => res.status(401).send({ err: err.message }))
})

module.exports = router
