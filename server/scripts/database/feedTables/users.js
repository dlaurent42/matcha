const usersJsonList = require('./data/users.json')
const query = require('../utils/query')

const users = database => (
  new Promise((resolve, reject) => {
    const promises = []
    usersJsonList.forEach((user) => {
      promises.push(
        query(
          database,
          '   INSERT INTO `users` '
          + '    (`username`, `firstname`, `lastname`, `email`, `password`, `salt`, `creation`, `birthday`, `popularity`, `is_account_confirmed`, `is_geolocation_allowed`, `id_gender`, `id_orientation`) '
          + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [
            user.username,
            user.first_name,
            user.last_name.toUpperCase(),
            user.email,
            user.password,
            user.salt,
            user.creation,
            user.birthday,
            user.popularity,
            user.is_account_confirmed,
            user.is_geolocation_allowed,
            user.gender,
            user.orientation,
          ]
        )
      )
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = users
