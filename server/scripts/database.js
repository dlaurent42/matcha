const mysql = require('mysql')
const { db } = require('../src/config')
const { isEmpty } = require('../src/utils')

// Function that checks if a table exist
const tableExists = (database, tableName) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT 1 FROM ${db.database}.${tableName};`, (err, res) => {
      if (isEmpty(err)) return resolve(true)
      return resolve(false)
    })
  })
}

// Function that runs query
const dbQuery = (database, sql, args) => {
  return new Promise((resolve, reject) => {
    database.query(sql, args, (err, rows) => {
      if (err) return reject(err)
      return resolve(rows)
    })
  })
}

// Create connection to database
const database = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
})

// Try connection to mysql
database.connect((err) => {
  if (err) console.log('[mysql] Cannot connect to mysql : ', err.message)
})

// Create database
database.query(`CREATE DATABASE IF NOT EXISTS ${db.database};`, (err, res) => {
  if (err) console.log('[mysql] Cannot create database: ', err.message)
})

// Use database
database.query(`USE ${db.database};`, (err, res) => {
  if (err) console.log('[mysql] Cannot select database: ', err.message)
})

// Create users table
const usersTable = new Promise((resolve, reject) =>
  resolve(
    tableExists(database, 'users')
      .then((res) => {
        if (res === false) return dbQuery(database, 'CREATE TABLE `users` ( `id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(255) NOT NULL , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , `salt` VARCHAR(255) NOT NULL , `registrationToken` VARCHAR(255) NOT NULL , `registrationDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , `age` INT NOT NULL , `gender` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;')
        else console.log('[mysql] Users table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Users table has been created')
      })
      .catch((err) => console.log(err))
  )
)

Promise.all([usersTable, totoTable]).then(() => {
  console.log('[mysql] Database is now up-to-date')
  process.exit()
})
