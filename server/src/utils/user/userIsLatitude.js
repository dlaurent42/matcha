const isNumeric = require('../string/isNumeric')

const isLatitude = latitude => (isNumeric(latitude) && latitude >= -90 && latitude <= 90)

module.exports = isLatitude
