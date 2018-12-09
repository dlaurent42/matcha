const express = require('express')
const Database = require('../../models/Database')
const JsonWebToken = require('../../models/JsonWebToken')
const {
  hash,
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

  let user = Object.assign(req.body.user)
  const database = new Database()
  const jwt = new JsonWebToken()

  // Check user data
  if (!dataCheck(user)) return res.sendStatus(401)

  // Check if password has been filled in
  if (isEmpty(user.password)) return res.sendStatus(401)

  return database.query('SELECT `salt` FROM `users` WHERE `username` = ? LIMIT 1;', [user.username])
    .then((rows) => {
      if (isEmpty(rows)) return res.sendStatus(401)
      const hashedPassword = hash(user.password, rows[0].salt)
      return database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`username`, '
        + '   `users`.`email`, '
        + '   `users`.`age`, '
        + '   `users`.`creation`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' WHERE `users`.`username` = ? AND `users`.`password` = ?'
        + ' LIMIT 1;',
        [user.username, hashedPassword]
      )
    })
    .then((rows) => {
      if (isEmpty(rows)) return res.sendStatus(401)
      user = Object.assign(rows[0])
      database.close()
      return jwt.create(rows[0])
    })
    .then((token) => {
      Object.assign(user, { token })
      return res.json({ user })
    })
    .catch(err => res.status(401).send({ err: err.message }))
})

router.get('/authenticate', (req, res) => {
  const user = {}
  const jwt = new JsonWebToken()
  const database = new Database()

  if (isEmpty(req.body.token)) return res.sendStatus(403)
  return jwt.check(req.body.token)
    .then((data) => {
      if (isEmpty(data)) return res.sendStatus(403)
      return database.query(
        '   SELECT '
        + '   `users`.`id`, '
        + '   `users`.`firstname`, '
        + '   `users`.`lastname`, '
        + '   `users`.`username`, '
        + '   `users`.`email`, '
        + '   `users`.`age`, '
        + '   `users`.`creation`, '
        + '   `users_gender`.`gender`, '
        + '   `users_sexual_orientation`.`orientation`'
        + ' FROM `users` '
        + ' LEFT JOIN `users_gender` ON `users_gender`.`id` = `users`.`id_gender`'
        + ' LEFT JOIN `users_sexual_orientation` ON `users_gender`.`id` = `users`.`id_orientation`'
        + ' WHERE `users`.`id` = ?'
        + ' LIMIT 1;',
        [data.id]
      )
    })
    .then((rows) => {
      if (isEmpty(rows)) return res.sendStatus(403)
      Object(user, rows[0])
      return jwt.refresh(rows[0])
    })
    .then((token) => {
      Object.assign(user, { token })
      return res.json({ user })
    })
    .catch(err => res.status(403).send({ err: err.message }))
})

module.exports = router
