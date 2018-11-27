const Database = require('./../Database')
const {
  hash,
  isEmpty,
} = require('../../utils')

const login = (user) => {
  // Check if user is not undefined
  if (isEmpty(user)) throw new Error('Please fill the form')

  const database = new Database()

  // Check if username has been filled in
  if (isEmpty(user.username)) throw new Error('Please enter your username')

  // Check if password has been filled in
  if (isEmpty(user.password)) throw new Error('Please enter your password')

  // Get salt string from username
  database.query('SELECT `hash` FROM `users` WHERE `username` = ? LIMIT 1;', { username: user.username })
    .then((rows) => {
      if (isEmpty(rows)) throw new Error('Wrong username or password')
      const hashedPassword = hash.sha512(user.password, rows[0].salt)
      return (database.query('SELECT * FROM `users` WHERE `username` = ? AND `password` = ? LIMIT 1;', { username: user.username, hashedPassword }))
    })
    .then((rows) => {
      if (isEmpty(rows)) throw new Error('Wrong username or password')
      database.close()
      return rows[0]
    })
    .catch((err) => {
      database.close()
      return err
    })
}

module.exports = login
