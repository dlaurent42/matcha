const createDatabase = require('./createDatabase')
const createTables = require('./createTables')
const feedTables = require('./feedTables')

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
      console.error(err)
      process.exit() // eslint-disable-line 
    })
}

migrateDatabase()
