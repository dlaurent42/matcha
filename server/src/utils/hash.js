const crypto = require('crypto')

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('hex')
}

const genRandomString = length => (
  crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
)

module.exports = { sha512, genRandomString }
