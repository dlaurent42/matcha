const createAuth = require('./auth')
const createBlock = require('./block')
const createChat = require('./chat')
const createFake = require('./fakes')
const createGender = require('./gender')
const createInterests = require('./interests')
const createLikes = require('./likes')
const createNotificqtions = require('./notifications')
const createOrientation = require('./orientation')
const createPasswordRecovery = require('./passwordRecovery')
const createPictures = require('./pictures')
const createRegistrations = require('./registration')
const createTokensBlacklist = require('./tokensBlacklist')
const createUsers = require('./users')

const createTables = database => (
  new Promise((resolve, reject) => (
    createAuth(database)
      .then(() => createBlock(database))
      .then(() => createChat(database))
      .then(() => createFake(database))
      .then(() => createGender(database))
      .then(() => createInterests(database))
      .then(() => createLikes(database))
      .then(() => createNotificqtions(database))
      .then(() => createOrientation(database))
      .then(() => createPasswordRecovery(database))
      .then(() => createPictures(database))
      .then(() => createRegistrations(database))
      .then(() => createTokensBlacklist(database))
      .then(() => createUsers(database))
      .then(() => resolve(database))
      .catch(err => reject(err))
  ))
)

module.exports = createTables
