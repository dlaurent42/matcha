module.exports = {
  register(req, res, next) {
    console.log(`Check here if ${req} and ${res} are correct`)
    next()
  },
}
