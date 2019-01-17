// Obj
const { isEmpty } = require('./obj/isEmpty')

// String
const hasDigit = require('./string/hasDigit')
const hash = require('./string/hash')
const hasLowercase = require('./string/hasLowercase')
const hasSpecial = require('./string/hasSpecial')
const hasUppercase = require('./string/hasUppercase')
const isAlpha = require('./string/isAlpha')
const isAlphaNumeric = require('./string/isAlphaNumeric')
const isFloat = require('./string/isFloat')
const isNumeric = require('./string/isNumeric')
const random = require('./string/random')

// User
const userGetAgeFromDate = require('./user/getAgeFromDate')
const userIsBirthdate = require('./user/isBirthdate')
const userIsEmail = require('./user/isEmail')
const userIsFirstname = require('./user/isFirstname')
const userIsLastname = require('./user/isLastname')
const userIsLatitude = require('./user/userIsLatitude')
const userIsLongitude = require('./user/userIsLongitude')
const userIsPassword = require('./user/isPassword')
const userIsUsername = require('./user/isUsername')
const userIsProfileComplete = require('./user/isProfileComplete')

export default {
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
  userGetAgeFromDate,
  userIsBirthdate,
  userIsEmail,
  userIsFirstname,
  userIsLastname,
  userIsLatitude,
  userIsLongitude,
  userIsPassword,
  userIsProfileComplete,
  userIsUsername
}
