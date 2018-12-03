const hasDigit = require('./hasDigit')
const hasLowercase = require('./hasLowercase')
const hasUppercase = require('./hasUppercase')
const hasSpecial = require('./hasSpecial')
const isAlpha = require('./isAlpha')
const isAlphaNumeric = require('./isAlphaNumeric')
const { isNumeric, isFloat } = require('./isNumeric')
const isEmail = require('./isEmail')
const isEmpty = require('./isEmpty')
const hash = require('./hash')
const template = require('./stringInterpolation')

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
  template,
}
