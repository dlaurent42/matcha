const mysql = require('mysql')
const { DATABASE } = require('../config/config')

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: DATABASE.HOST,
      user: DATABASE.USER,
      password: DATABASE.PASS,
      database: DATABASE.NAME,
    })
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err)
        return resolve(rows)
      })
    })
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

module.exports = Database
