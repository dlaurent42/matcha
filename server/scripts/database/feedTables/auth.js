const authJsonList = require('./data/auth.json')
const query = require('../utils/query')

const auth = database => (
  new Promise((resolve, reject) => {
    const promises = []
    authJsonList.forEach((row) => {
      promises.push(query(database, 'INSERT INTO `auth` (`user_id`, `client_id`, `client_secret`) VALUES (?, ?);', [row.userId, row.clientId, row.clientSecret]))
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] auth table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = auth
