const mysql = require('mysql')
const { db } = require('../src/config')
const { isEmpty } = require('../src/utils')

// Function that checks if a table exist
const tableExists = (database, tableName) => (
  new Promise((resolve) => {
    database.query(`SELECT 1 FROM ${db.database}.${tableName};`, (err) => {
      if (isEmpty(err)) return resolve(true)
      return resolve(false)
    })
  })
)

// Function that runs query
const dbQuery = (database, sql, args) => (
  new Promise((resolve, reject) => {
    database.query(sql, args, (err, rows) => {
      if (err) return reject(err)
      return resolve(rows)
    })
  })
)

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
database.query(`CREATE DATABASE IF NOT EXISTS ${db.database};`, (err) => {
  if (err) console.log('[mysql] Cannot create database: ', err.message)
})

// Use database
database.query(`USE ${db.database};`, (err) => {
  if (err) console.log('[mysql] Cannot select database: ', err.message)
})

// Create table containing user information
const usersTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `username` VARCHAR(255) NOT NULL , '
            + '  `firstname` VARCHAR(255) NOT NULL , '
            + '  `lastname` VARCHAR(255) NOT NULL , '
            + '  `email` VARCHAR(255) NOT NULL , '
            + '  `password` VARCHAR(255) NOT NULL , '
            + '  `salt` VARCHAR(255) NOT NULL , '
            + '  `creation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , '
            + '  `age` INT , '
            + '  `id_gender` INT , '
            + '  `id_orientation` INT , '
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Users table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Users table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing genders
const genderTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_gender')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_gender` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `gender` VARCHAR(30) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Gender table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Gender table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing sexual orientations
const orientationTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_sexual_orientation')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_sexual_orientation` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `orientation` VARCHAR(30) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Sexual orientation table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Sexual orientation table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing interest (tag format)
const interestsTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_interests')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_interests` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `tag` VARCHAR(30) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Interests table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Interests table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing registration tokens sent by mail
const registrationTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_registration')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_registration` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `token` TEXT NOT NULL , '
            + '  `expiration_date` TIMESTAMP NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Registration table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Registration table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing expired json web tokens (= user logout)
const blacklistTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'tokens_blacklist')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `tokens_blacklist` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `token` TEXT NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Blacklist table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Blacklist table has been created')
      })
      .catch(err => console.log(err))
  )
))

Promise.all([
  usersTable,
  genderTable,
  orientationTable,
  interestsTable,
  registrationTable,
  blacklistTable,
]).then(() => {
  console.log('[mysql] Database is now up-to-date')
  process.exit() // eslint-disable-line
})
