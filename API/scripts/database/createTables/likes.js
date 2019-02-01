const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const likes = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_likes')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_likes` '
            + '( '
            + '  `liker_id` INT NOT NULL , '
            + '  `liked_id` INT NOT NULL , '
            + '  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_likes table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_likes table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = likes
