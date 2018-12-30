// Obj
const isEmpty = require('./obj/isEmpty')

// String
const hasDigit = require('./string/hasDigit')
const hash = require('./string/hash')
const hasLowercase = require('./string/hasLowercase')
const hasSpecial = require('./string/hasSpecial')
const hasUppercase = require('./string/hasUppercase')
const template = require('./string/interpolation')
const isAlpha = require('./string/isAlpha')
const isAlphaNumeric = require('./string/isAlphaNumeric')
const isFloat = require('./string/isFloat')
const isNumeric = require('./string/isNumeric')
const random = require('./string/random')

// User
const userDateToAge = require('./user/ageFromDate')
const userIsEmail = require('./user/isEmail')
const userIsFirstname = require('./user/isFirstname')
const userIsLastname = require('./user/isLastname')
const userIsPassword = require('./user/isPassword')
const userIsUsername = require('./user/isUsername')

module.exports = {
  hash,
  hasDigit,
  hasLowercase,
  hasUppercase,
  hasSpecial,
  isAlpha,
  isAlphaNumeric,
  isNumeric,
  isFloat,
  isEmpty,
  random,
  template,
  userDateToAge,
  userIsEmail,
  userIsFirstname,
  userIsLastname,
  userIsPassword,
  userIsUsername,
}
