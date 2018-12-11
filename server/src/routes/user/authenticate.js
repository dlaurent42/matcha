const express = require('express')
const User = require('../../models/User')
const JsonWebToken = require('../../models/JsonWebToken')
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
  let userOutput = {}

  // Check user data
  if (!dataCheck(userInput)) return res.sendStatus(401)

  return user.fetchInformationByUsernameAndPassword(userInput.username, userInput.password)
    .then((userData) => {
      userOutput = Object.assign(userData)
      const jwt = new JsonWebToken()
      return jwt.create(userOutput)
    })
    .then((identificationToken) => {
      userOutput = Object.assign(userOutput, { identificationToken })
      return res.json({ user: userOutput })
    })
    .catch(err => res.status(401).send({ err: err.message }))
})

module.exports = router
