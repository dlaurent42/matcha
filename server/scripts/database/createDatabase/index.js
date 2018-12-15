const connect = require('./connect')
const create = require('./create')
const use = require('./use')

const createDatabase = () => {
  const database = connect()
  return new Promise((resolve, reject) => (
    create(database)
      .then(() => {
        console.log('[mysql] Database has been created')
        return use(database)
      })
      .then(() => {
        console.log('[mysql] Connection to database has been set')
        return resolve(database)
      })
      .catch(err => reject(err))
  ))
}

module.exports = createDatabase
