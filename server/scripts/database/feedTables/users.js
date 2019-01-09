const usersJsonList = require('./data/users.json')
const query = require('../utils/query')

const users = database => (
  new Promise((resolve, reject) => {
    const promises = []
    const latitude = 48.8534
    const longitude = 2.3488
    usersJsonList.forEach((user) => {
      promises.push(
        query(
          database,
          '   INSERT INTO `users` '
          + '    (`username`, `firstname`, `lastname`, `email`, `password`, `salt`, `creation`, `birthday`, `popularity`, `is_account_confirmed`, `is_geolocation_allowed`, `id_gender`, `biography`, `is_connected`, `last_connection`, `latitude`, `longitude`, `is_profile_complete`) '
          + ' VALUES (?, ?, UPPER(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);',
          [
            user.username,
            user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.salt,
            user.creation,
            user.birthday,
            user.popularity,
            user.is_account_confirmed,
            user.is_geolocation_allowed,
            user.gender,
            user.biography,
            user.is_connected,
            user.last_connection,
            latitude + Math.random() * 2 - 1,
            longitude + Math.random() - 0.5,
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
