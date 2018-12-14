const { db } = require('../../../src/config')

const use = database => (
  new Promise((resolve, reject) => (
    database.query(`USE ${db.database};`, (err) => {
      if (err) reject(new Error('[mysql] Cannot witch to database: ', err.message))
      resolve()
    })
  ))
)

module.exports = use
