const interestsJsonList = require('./data/tags.json')
const query = require('../utils/query')

const interests = database => (
  new Promise((resolve, reject) => {
    const promises = []
    interestsJsonList.forEach((interest) => {
      promises.push(query(database, 'INSERT INTO `users_interests` (`user_id`, `tag`) VALUES (?, ?);', [interest.user_id, interest.tag]))
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_interests table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = interests
