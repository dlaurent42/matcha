const express = require('express')
const Database = require('../../models/Database')
const { isEmpty } = require('../../utils')

const router = express.Router()

router.get('/:id', (req, res) => {
  const database = new Database()
  console.log(req)
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
    + ' WHERE `users`.`id` = ?;',
    [req.params.id]
  )
    .then((rows) => {
      if (isEmpty(rows)) res.json({ err: 'no user found' })
      else res.json({ user: rows })
    })
    .catch((err) => {
      res.json({ err })
    })
})

module.exports = router
