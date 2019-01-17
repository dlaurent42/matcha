const { isEmpty } = require('../obj/isEmpty')
const isAlphaNumeric = require('../string/isAlphaNumeric')
const { NAME_MIN_LEN, NAME_MAX_LEN } = require('../../config/constants').BOUNDARY_VALUES

const isUsername = (username) => {
  if (isEmpty(username)) return false
  if (username.length < NAME_MIN_LEN || username.length > NAME_MAX_LEN) return false
  if (!isAlphaNumeric(username)) return false
  return true
}

module.exports = isUsername
