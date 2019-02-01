const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const blocked = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_blocked')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_blocked` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `blocker_id` INT NOT NULL , '
            + '  `blocked_id` INT NOT NULL , '
            + '  `block_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_blocked table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_blocked table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = blocked
