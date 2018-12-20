const router = require('express').Router()
const User = require('../../models/User')
const {
  isEmpty,
  userIsUsername,
  userIsPassword,
} = require('../../utils')

const dataCheck = user => (
  userIsUsername(user.username)
  && userIsPassword(user.password)
)

router.post('/authenticate', (req, res) => {
  // Check input
  if (isEmpty(req.body.user)) return res.status(400).send({ err: 'Missing argument.' })

  const userInput = Object.assign(req.body.user)
  const user = new User()

  // Check user data
  if (!dataCheck(userInput)) return res.sendStatus(401)

  return user.fetchInformationByUsernameAndPassword(userInput.username, userInput.password)
    .then(() => user.createToken())
    .then(userData => res.json({ user: userData }))
    .catch(err => res.status(401).send({ err: err.message }))
})

module.exports = router
