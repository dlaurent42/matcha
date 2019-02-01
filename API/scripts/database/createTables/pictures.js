const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const pictures = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_pictures')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_pictures` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `filename` VARCHAR(255) NOT NULL , '
            + '  `is_profile_pic` BOOLEAN NOT NULL DEFAULT false, '
            + '  `import` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_pictures table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_pictures table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = pictures
