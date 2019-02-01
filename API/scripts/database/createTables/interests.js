const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const interests = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_interests')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_interests` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `tag` VARCHAR(30) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_interests table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_interests table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = interests
