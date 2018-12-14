const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const chat = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_messages')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_messages` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `owner_id` INT NOT NULL , '
            + '  `with_id` INT NOT NULL , '
            + '  `emitter_id` INT NOT NULL , '
            + '  `receiver_id` INT NOT NULL , '
            + '  `content` TEXT , '
            + '  `seen` BOOLEAN NOT NULL DEFAULT false, '
            + '  `creation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_messages table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_messages table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = chat
