const gendersJsonList = require('./data/genders.json')
const query = require('../utils/query')

const genders = database => (
  new Promise((resolve, reject) => {
    const promises = []
    gendersJsonList.forEach((gender) => {
      promises.push(query(database, 'INSERT INTO `users_gender` (`gender`) VALUES (?);', [gender.gender]))
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_gender table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = genders
