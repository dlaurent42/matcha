const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const notifications = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_notifications')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_notifications` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `emitter_id` INT NOT NULL , '
            + '  `receiver_id` INT NOT NULL , '
            + '  `type` ENUM (\'like\', \'unlike\', \'message\', \'match\', \'view\') NOT NULL , '
            + '  `is_opened` BOOLEAN NOT NULL DEFAULT false, '
            + '  `creation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_notifications table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_notifications table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = notifications
