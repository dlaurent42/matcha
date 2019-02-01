const { isEmpty } = require('../../../src/utils')
const { DATABASE } = require('../../../src/config/config')

const tableExists = (database, tableName) => (
  new Promise((resolve) => {
    database.query(`SELECT 1 FROM ${DATABASE.NAME}.${tableName};`, (err) => {
      if (isEmpty(err)) return resolve(true)
      return resolve(false)
    })
  })
)

module.exports = tableExists
