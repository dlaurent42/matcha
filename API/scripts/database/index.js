const createDatabase = require('./createDatabase')
const createTables = require('./createTables')
const feedTables = require('./feedTables')
const { isEmpty } = require('../../src/utils')

const migrateDatabase = () => {
  let database
  createDatabase()
    .then((db) => {
      database = db
      return createTables(database)
    })
    .then(() => feedTables(database))
    .then(() => {
      console.log('[mysql] Database has been succesfully updated')
      process.exit() // eslint-disable-line 
    })
    .catch((err) => {
      if (isEmpty(err.message)) console.error(err)
      else console.error(err.message)
      process.exit() // eslint-disable-line 
    })
}

migrateDatabase()
