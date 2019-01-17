const { isEmpty } = require('../obj/isEmpty')
const { EMAIL_MAX_LEN } = require('../../config/constants').BOUNDARY_VALUES

const isEmail = (email) => {
  if (isEmpty(email)) return false
  if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false) return false // eslint-disable-line
  if (email.length > EMAIL_MAX_LEN) return false
  return true
}

module.exports = isEmail
