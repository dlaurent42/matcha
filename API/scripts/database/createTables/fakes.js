const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const fakes = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_fakes')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_fakes` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `reporter_id` INT NOT NULL , '
            + '  `reported_id` INT NOT NULL , '
            + '  `report_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_fakes table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_fakes table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = fakes
