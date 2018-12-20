const { DATABASE } = require('../../../src/config/config')

const use = database => (
  new Promise((resolve, reject) => (
    database.query(`USE ${DATABASE.NAME};`, (err) => {
      if (err) reject(new Error('[mysql] Cannot witch to database: ', err.message))
      resolve()
    })
  ))
)

module.exports = use
