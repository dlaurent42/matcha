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
      database.end((err) => { console.error(err) })
      process.exit() // eslint-disable-line 
    })
    .catch((err) => {
      if (isEmpty(err.message)) console.error(err)
      else console.error(err.message)
      database.end((error) => { console.error(error) })
      process.exit() // eslint-disable-line 
    })
}

migrateDatabase()
