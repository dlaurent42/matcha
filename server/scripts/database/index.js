const mysql = require('mysql')
const { db } = require('../../src/config')
const { isEmpty } = require('../../src/utils')

const database = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
})

// Try connection to mysql
database.connect((err) => {
  if (err) console.log('[mysql] Cannot connect to mysql : ', err.message)
})
