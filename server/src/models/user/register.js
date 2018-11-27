const Database = require('./../Database')
const {
  hash,
  isEmpty,
  isAlpha,
  isAlphaNumeric,
  isEmail,
  hasDigit,
  hasLowercase,
  hasUppercase,
  hasSpecial,
  toCapitalize,
  toUppercase,
} = require('../../utils')

const register = (user) => {
  // Check if user is not undefined
  if (isEmpty(user)) throw new Error('Please fill the form')

  const database = new Database()
  // Check username
  if (isEmpty(user.username)) throw new Error('Please enter a username')
  if (user.username.length < 5 || user.username.length > 25) throw new Error('Username must contains between 5 and 25 characters')
  if (!isAlphaNumeric(user.username)) throw new Error('Username must contains only letters and numbers')

  // Check if firstname
  if (isEmpty(user.firstname)) throw new Error('Please enter a firstname')
  if (user.firstname.length < 5 || user.firstname.length > 25) throw new Error('Firstname must contains between 5 and 25 characters')
  if (!isAlpha(user.firstname)) throw new Error('Firstname must contains only letters')

  // Check if lastname
  if (isEmpty(user.lastname)) throw new Error('Please enter a lastname')
  if (user.lastname.length < 5 || user.lastname.length > 25) throw new Error('Lastname must contains between 5 and 25 characters')
  if (!isAlpha(user.lastname)) throw new Error('Lastname must contains only letters')

  // Check if email
  if (isEmpty(user.email)) throw new Error('Please enter an email address')
  if (!isEmail(user.email)) throw new Error('Please enter a valid email address')
  if (user.email.length > 254) throw new Error('Email must contains at most 254 characters')

  // Check if password
  if (isEmpty(user.password)) throw new Error('Please enter a password')
  if (user.password.length < 8) throw new Error('Password must contains at least 8 characters')
  if (!(hasDigit(user.password)
  && hasSpecial(user.password)
  && hasLowercase(user.password)
  && hasUppercase(user.password))) throw new Error('Password must contains at least a digit, an uppercase letter, a lowercase letter and a special character')

  // Check if cpassword
  if (isEmpty(user.cpassword)) throw new Error('Please confirm your password')
  if (user.password !== user.cpassword) throw new Error('Confirmed password is different from entered password')

  // Query database to know if user already exists (based on username and email)
  database.query('SELECT * FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;', { username: user.username, email: user.email })
    .then((rows) => {
      if (!isEmpty(rows)) throw new Error('An account with entered email/username already exists')
      const salt = hash.genRandomString(255)
      const regToken = hash.genRandomString(255)
      const hashedPassword = hash.sha512(user.password, salt)
      const formattedFirstname = toCapitalize(user.firstname)
      const formattedLastname = toUppercase(user.lastname)
      return (database.query(
        'INSERT INTO `users` (`username`, `firstname`, `lastname`, `password`, `salt`, `regToken`) VALUES (?, ?, ?, ?, ?, ?);',
        {
          username: user.username,
          formattedFirstname,
          formattedLastname,
          hashedPassword,
          salt,
          regToken,
        }
      ))
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

module.exports = register
