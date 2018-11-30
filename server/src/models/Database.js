  const mysql = require('mysql')
const { db } = require('../config')

class Database {
  constructor() {
    this.connection = mysql.createConnection(db)
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
