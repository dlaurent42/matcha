const router = require('express').Router()
const User = require('../../models/User')
const {
  isEmpty,
  userIsUsername,
  userIsPassword,
} = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

const dataCheck = user => (
  userIsUsername(user.username)
  && userIsPassword(user.password)
)

router.get('/authenticate', (req, res) => {
  // Check input
  if (isEmpty(req.body.user)) return res.status(400).json({ err: ERRORS.DATA_MISSING })

  // Check user data
  if (!dataCheck(req.body.user)) return res.status(401).json({ err: ERRORS.DATA_VALIDATION })

  const user = new User()
  return user.fetchInformationByUsernameAndPassword(req.body.user.username, req.body.user.password)
    .then(() => user.addIdentificationToken())
    .then(userData => res.json({ user: userData }))
    .catch(err => res.status(401).send({ err: err.message }))
})

module.exports = router
