const hasDigit = require('./hasDigit')
const hasLowercase = require('./hasLowercase')
const hasUppercase = require('./hasUppercase')
const hasSpecial = require('./hasSpecial')
const isAlpha = require('./isAlpha')
const isAlphaNumeric = require('./isAlphaNumeric')
const { isNumeric, isFloat } = require('./isNumeric')
const isEmail = require('./isEmail')
const isEmpty = require('./isEmpty')
const toCapitalize = require('./toCapitalize')
const toLowercase = require('./toLowercase')
const toUppercase = require('./toUppercase')
const hash = require('./hash')

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
  isEmail,
  isEmpty,
  toCapitalize,
  toLowercase,
  toUppercase,
}
