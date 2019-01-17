const { isEmpty } = require('../obj/isEmpty')
const getAgeFromDate = require('./getAgeFromDate')
const { BOUNDARY_VALUES } = require('../../config/constants')

// Expected date format : YYYY-MM-DD
const isBirthdate = (date) => {
  if (isEmpty(date)) return false
  if (date.length !== 'YYYY-MM-DD'.length || date.split('-').length !== 3) return false
  const age = getAgeFromDate(date)
  if (isEmpty(age) || age < BOUNDARY_VALUES.AGE_MIN || age > BOUNDARY_VALUES.AGE_MAX) return false
  return true
}

module.exports = isBirthdate
