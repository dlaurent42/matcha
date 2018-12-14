const mysql = require('mysql')
const { db } = require('../../../src/config')

const connect = () => {
  const database = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
  })

  database.connect((err) => {
    if (err) console.log('[mysql] Cannot connect to mysql : ', err.message)
  })

  return database
}

module.exports = connect
