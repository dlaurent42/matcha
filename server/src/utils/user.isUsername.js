const {
  isEmpty,
  isAlphaNumeric,
} = require('.')

const isUsername = (username) => {
  if (isEmpty(username)) return false
  if (username.length < 5 || username.length > 25) return false
  if (!isAlphaNumeric(username)) return false
  return true
}

module.exports = isUsername