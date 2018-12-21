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

  // Check user data
  if (!dataCheck(req.body.user)) return res.sendStatus(401)

  const user = new User()
  return user.fetchInformationByUsernameAndPassword(req.body.user.username, req.body.user.password)
    .then(() => user.addIdentificationToken())
    .then(userData => res.json({ user: userData }))
    .catch(err => res.status(401).send({ err: err.message }))
})

module.exports = router
