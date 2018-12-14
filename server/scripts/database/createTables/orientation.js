const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const orientation = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_sexual_orientation')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_sexual_orientation` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `orientation` VARCHAR(30) NOT NULL , '
            + '  UNIQUE (orientation),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_sexual_orientation table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_sexual_orientation table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = orientation
