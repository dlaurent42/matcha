const {
  isEmpty,
  isAlpha,
} = require('.')

const isLastname = (lastname) => {
  if (isEmpty(lastname)) return false
  if (lastname.length < 5 || lastname.length > 25) return false
  if (!isAlpha(lastname)) return false
  return true
}

module.exports = isLastname
