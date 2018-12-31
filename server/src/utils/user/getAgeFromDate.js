const isEmpty = require('../obj/isEmpty')

const getAgeFromDate = (birthDate) => {
  if (isEmpty(birthDate)) return null
  const dt = new Date()
  const diffYears = parseInt(dt.getFullYear(), 10) - parseInt(birthDate.split('/')[0], 10)
  const diffMonths = parseInt(birthDate.split('/')[1], 10) - parseInt(dt.getFullYear(), 10) - 1
  const diffDays = parseInt(birthDate.split('/')[2], 10) - parseInt(dt.getDate(), 10)
  if (diffMonths > 0 || (diffMonths === 0 && diffDays > 0)) return diffYears - 1
  return diffYears
}

module.exports = getAgeFromDate
