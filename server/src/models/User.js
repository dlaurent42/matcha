const Database = require('./Database')
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
} = require('../utils')

const database = new Database()

class User {
  constructor() {
    this.name = ''
    this.auth = false
  }

  getIsAuthenticated() {
    return this.isAuthenticated
  }

  authenticate(username, password) {
    // Check if username has been filled in
    if (isEmpty(username)) throw new Error('Please enter your username')

    // Check if password has been filled in
    if (isEmpty(password)) throw new Error('Please enter your password')

    // Get salt string from username
    database.query('SELECT `hash` FROM `users` WHERE `username` = ? LIMIT 1;', { username })
      .then((rows) => {
        if (isEmpty(rows)) throw new Error('Wrong username or password')
        const hashedPassword = hash.sha512(password, rows[0].salt)
        return (database.query('SELECT * FROM `users` WHERE `username` = ? AND `password` = ? LIMIT 1;', { username, hashedPassword }))
      })
      .then((rows) => {
        if (isEmpty(rows)) throw new Error('Wrong username or password')
        this.id = rows[0].id
        this.firstname = rows[0].firstname
        this.lastname = rows[0].lastname
        this.username = rows[0].username
        this.email = rows[0].email
        this.isAuthenticated = true
        database.close()
      })
      .catch((err) => {
        console.log(err)
        database.close()
      })
  }

  register(username, firstname, lastname, email, password, cpassword) {
    // Check username
    if (isEmpty(username)) throw new Error('Please enter a username')
    if (username.length < 5 || username.length > 25) throw new Error('Username must contains between 5 and 25 characters')
    if (!isAlphaNumeric(username)) throw new Error('Username must contains only letters and numbers')

    // Check if firstname
    if (isEmpty(firstname)) throw new Error('Please enter a firstname')
    if (firstname.length < 5 || firstname.length > 25) throw new Error('Firstname must contains between 5 and 25 characters')
    if (!isAlpha(firstname)) throw new Error('Firstname must contains only letters')

    // Check if lastname
    if (isEmpty(lastname)) throw new Error('Please enter a lastname')
    if (lastname.length < 5 || lastname.length > 25) throw new Error('Lastname must contains between 5 and 25 characters')
    if (!isAlpha(lastname)) throw new Error('Lastname must contains only letters')

    // Check if email
    if (isEmpty(email)) throw new Error('Please enter an email address')
    if (!isEmail(email)) throw new Error('Please enter a valid email address')
    if (email.length > 254) throw new Error('Email must contains at most 254 characters')

    // Check if password
    if (isEmpty(password)) throw new Error('Please enter a password')
    if (password.length < 8) throw new Error('Password must contains at least 8 characters')
    if (!(hasDigit(password)
    && hasSpecial(password)
    && hasLowercase(password)
    && hasUppercase(password))) throw new Error('Password must contains at least a digit, an uppercase letter, a lowercase letter and a special character')

    // Check if cpassword
    if (isEmpty(cpassword)) throw new Error('Please confirm your password')
    if (password !== cpassword) throw new Error('Confirmed password is different from entered password')

    // Query database to know if user already exists (based on username and email)
    database.query('SELECT * FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;', { username, email })
      .then((rows) => {
        if (!isEmpty(rows)) throw new Error('An account with entered email/username already exists')
        const salt = hash.genRandomString(255)
        const regToken = hash.genRandomString(255)
        const hashedPassword = hash.sha512(password, salt)
        const formattedFirstname = toCapitalize(firstname)
        const formattedLastname = toUppercase(lastname)
        return (database.query(
          'INSERT INTO `users` (`username`, `firstname`, `lastname`, `password`, `salt`, `regToken`) VALUES (?, ?, ?, ?, ?, ?);',
          {
            username,
            formattedFirstname,
            formattedLastname,
            hashedPassword,
            salt,
            regToken,
          }
        ))
      })
      .then((rows) => {
        this.id = rows[0].id
        this.firstname = rows[0].firstname
        this.lastname = rows[0].lastname
        this.username = rows[0].username
        this.email = rows[0].email
        this.isAuthenticated = true
      })
      .catch((err) => {
        console.log(err)
        database.close()
      })
  }
}

module.exports = User
