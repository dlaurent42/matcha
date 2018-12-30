const isEmpty = require('../obj/isEmpty')
const { AGE_MAX } = require('../../config/constants').DEFAULT_VALUES

const ageFromDate = (birthDate) => {
  if (isEmpty(birthDate)) return AGE_MAX
  const dt = new Date()
  const diffYears = parseInt(dt.getFullYear(), 10) - parseInt(birthDate.split('/')[0], 10)
  const diffMonths = parseInt(birthDate.split('/')[1], 10) - parseInt(dt.getFullYear(), 10) - 1
  const diffDays = parseInt(birthDate.split('/')[2], 10) - parseInt(dt.getDate(), 10)
  if (diffMonths > 0 || (diffMonths === 0 && diffDays > 0)) return diffYears - 1
  return diffYears
}

module.exports = ageFromDate
