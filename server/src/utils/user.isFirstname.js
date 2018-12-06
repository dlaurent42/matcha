const {
  isEmpty,
  isAlpha,
} = require('.')

const isFirstname = (firstname) => {
  if (isEmpty(firstname)) return false
  if (firstname.length < 5 || firstname.length > 25) return false
  if (!isAlpha(firstname)) return false
  return true
}

module.exports = isFirstname
