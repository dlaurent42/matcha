const usersJsonList = require('./data/users.json')
const query = require('../utils/query')

const pictures = database => (
  new Promise((resolve, reject) => {
    const promises = []
    usersJsonList.forEach((user) => {
      const rdm = Math.floor(Math.random() * 3)
      for (let i = 0; i < rdm; i += 1) {
        const isProfilePic = (i === 0) ? 1 : 0
        let filename
        if (user.gender === 1) filename = `male/image-${Math.floor(Math.random() * 116) + 1}.png`
        else if (user.gender === 2) filename = `female/image-${Math.floor(Math.random() * 116) + 1}.png`
        else if (user.gender === 3 && user.id <= 475) filename = `male/image-${Math.floor(Math.random() * 116) + 1}.png`
        else if (user.gender === 3 && user.id <= 500) filename = `female/image-${Math.floor(Math.random() * 116) + 1}.png`
        promises.push(
          query(
            database,
            '   INSERT INTO `users_pictures` '
            + '   (`user_id`, `filename`, `is_profile_pic`)'
            + ' VALUES'
            + '   (?, ?, ?);',
            [
              user.id,
              filename,
              isProfilePic,
            ]
          )
        )
      }
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_pictures table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = pictures
