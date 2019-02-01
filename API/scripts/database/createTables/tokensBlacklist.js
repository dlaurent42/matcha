const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const tokensBlacklist = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'tokens_blacklist')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `tokens_blacklist` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `token` TEXT , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] tokens_blacklist table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] tokens_blacklist table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = tokensBlacklist
