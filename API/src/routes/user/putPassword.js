const router = require('express').Router()
const User = require('../../models/User')
const Database = require('../../models/Database')
const {
  hash,
  isEmpty,
  userIsPassword,
  isNumeric,
} = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

router.put('/:id/password', (req, res) => {
  // Check if user id is numeric
  if (!isNumeric(req.params.id)) return res.sendStatus(404)

  // Check empty fields
  if (isEmpty(req.body.current_password)
  || isEmpty(req.body.new_password)
  || isEmpty(req.body.confirmed_new_password)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING })
  }

  // Check password / confirmed password
  if (!userIsPassword(req.body.new_password, req.body.confirmed_new_password)) {
    return res.status(400).json({ err: ERRORS.DATA_VALIDATION })
  }
  const user = new User()
  return new Database().query('SELECT * FROM `users` WHERE `id` = ?;', [req.params.id])
    .then((rows) => {
      if (isEmpty(rows)) return res.json({ err: ERRORS.USER_NO_USER })
      const currentPasswordHashed = hash(req.body.current_password, rows[0].salt)
      if (currentPasswordHashed !== rows[0].password) throw new Error(ERRORS.USER_WRONG_PASSWORD)
      return user.setPassword(req.params.id, req.body.new_password)
    })
    .then(() => user.setProfileComplete(req.params.id))
    .then(userData => res.json({ user: userData }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
