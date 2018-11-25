const isNumeric = str => /^-{0,1}\d+$/.test(str)
const isFloat = str => /^\d+\.\d+$/.test(str)

module.exports = { isNumeric, isFloat }
