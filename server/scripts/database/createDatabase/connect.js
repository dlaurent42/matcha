const mysql = require('mysql')
const { DATABASE } = require('../../../src/config/config')

const connect = () => {
  const database = mysql.createConnection({
    host: DATABASE.HOST,
    user: DATABASE.USER,
    password: DATABASE.PASS,
  })

  database.connect((err) => {
    if (err) console.log('[mysql] Cannot connect to mysql : ', err.message)
  })

  return database
}

module.exports = connect
