const isEmpty = require('../obj/isEmpty')
const isAlpha = require('../string/isAlpha')
const { NAME_MIN_LEN, NAME_MAX_LEN } = require('../../config/constants').BOUNDARY_VALUES

const isFirstname = (firstname) => {
  if (isEmpty(firstname)) return false
  if (firstname.length < NAME_MIN_LEN || firstname.length > NAME_MAX_LEN) return false
  if (!isAlpha(firstname)) return false
  return true
}

module.exports = isFirstname
