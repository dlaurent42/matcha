const isEmpty = require('./obj.isEmpty')
const hasDigit = require('./string.hasDigit')
const hasSpecial = require('./string.hasSpecial')
const hasLowercase = require('./string.hasLowercase')
const hasUppercase = require('./string.hasUppercase')

const isPassword = (password, cpassword) => {
  if (isEmpty(password)) return false
  if (password.length < 8) return false
  if (!(hasDigit(password)
  && hasSpecial(password)
  && hasLowercase(password)
  && hasUppercase(password))) return false
  if (!isEmpty(cpassword) && cpassword !== password) return false
  return true
}

module.exports = isPassword
