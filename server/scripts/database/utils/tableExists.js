const { isEmpty } = require('../../../src/utils')
const { db } = require('../../../src/config')

const tableExists = (database, tableName) => (
  new Promise((resolve) => {
    database.query(`SELECT 1 FROM ${db.database}.${tableName};`, (err) => {
      if (isEmpty(err)) return resolve(true)
      return resolve(false)
    })
  })
)

module.exports = tableExists
