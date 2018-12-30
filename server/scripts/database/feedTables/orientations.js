const orientationsJsonList = require('./data/orientations.json')
const query = require('../utils/query')

const orientations = database => (
  new Promise((resolve, reject) => {
    const promises = []
    orientationsJsonList.forEach((orientation) => {
      promises.push(query(database, 'INSERT INTO `users_sexual_orientation` (`user_id`,`gender_id`) VALUES (?, ?);', [orientation.user_id, orientation.gender_id]))
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_sexual_orientation table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = orientations
