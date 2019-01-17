const { isEmpty } = require('../obj/isEmpty')
const isAlpha = require('../string/isAlpha')
const { NAME_MIN_LEN, NAME_MAX_LEN } = require('../../config/constants').BOUNDARY_VALUES

const isLastname = (lastname) => {
  if (isEmpty(lastname)) return false
  if (lastname.length < NAME_MIN_LEN || lastname.length > NAME_MAX_LEN) return false
  if (!isAlpha(lastname)) return false
  return true
}

module.exports = isLastname
