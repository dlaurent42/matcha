const tableExists = require('../utils/tableExists')
const query = require('../utils/query')
const { isEmpty } = require('../../../src/utils')

const passwordRecovery = database => (
  new Promise((resolve, reject) => {
    tableExists(database, 'users_password_recovery')
      .then((res) => {
        if (res === false) {
          return query(
            database,
            'CREATE TABLE `users_password_recovery` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `token` VARCHAR(255) NOT NULL , '
            + '  `expiration_date` TIMESTAMP NOT NULL , '
            + '  UNIQUE (token),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        throw new Error('[mysql] users_password_recovery table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] users_password_recovery table has been created')
        resolve()
      })
      .catch(err => reject(err))
  })
)

module.exports = passwordRecovery
