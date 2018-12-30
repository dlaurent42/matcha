const feedAuth = require('./auth')
const feedGenders = require('./genders')
const feedInterests = require('./interests')
const feedLikes = require('./likes')
const feedNotifications = require('./notifications')
const feedOrientations = require('./orientations')
const feedUsers = require('./users')

const feedTables = database => (
  new Promise((resolve, reject) => (
    feedAuth(database)
      .then(() => feedGenders(database))
      .then(() => feedInterests(database))
      .then(() => feedLikes(database))
      .then(() => feedNotifications(database))
      .then(() => feedOrientations(database))
      .then(() => feedUsers(database))
      .then(() => resolve())
      .catch(err => reject(err))
  ))
)

module.exports = feedTables
