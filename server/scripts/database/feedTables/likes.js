const likesJsonList = require('./data/likes.json')
const query = require('../utils/query')

const likes = database => (
  new Promise((resolve, reject) => {
    const promises = []
    likesJsonList.forEach((like) => {
      if (like.liker_id !== like.liked_id) {
        promises.push(query(database, 'INSERT INTO `users_likes` (`liker_id`, `liked_id`, `date`) VALUES (?, ?, ?);', [like.liker_id, like.liked_id, like.date]))
      }
    })
    return Promise.all(promises)
      .then(() => {
        console.log('[mysql] users_likes table has been feeded')
        return resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = likes
