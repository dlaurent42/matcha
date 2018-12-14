const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const gender = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_gender')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_gender` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `gender` VARCHAR(30) NOT NULL , '
            + '  UNIQUE (gender),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_gender table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_gender table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = gender
