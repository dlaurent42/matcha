const isNumeric = require('../string/isNumeric')

const isLongitude = longitude => (isNumeric(longitude) && longitude >= -180 && longitude <= 180)

module.exports = isLongitude
