const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const auth = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'auth')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `auth` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `clientId` VARCHAR(255) NOT NULL , '
            + '  `clientSecret` VARCHAR(255) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] auth table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] auth table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = auth
