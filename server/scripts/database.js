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

// Create table containing auth information
const authTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'auth')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `auth` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `clientId` VARCHAR(255) NOT NULL , '
            + '  `clientSecret` VARCHAR(255) NOT NULL , '
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Auth table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Auth table has been created')
        return dbQuery(
          database,
          'INSERT INTO `auth` (`clientId`, `clientSecret`) VALUES (\'A968DCBAE348712A843CB15423E49953D7A0883F0D74E6E18044773F07393D0D\', \'D1BE2ECDFDC4850CF5AEAE16A6F9481EB97FD6988CCF7A9195002BF577F292EA\');'
        )
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Auth table has been filled')
      })
      .catch(err => console.log(err))
  )
))

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
            + '  `birthday` DATE , '
            + '  `popularity` INT NOT NULL DEFAULT 0, '
            + '  `biography` TEXT, '
            + '  `is_account_confirmed` BOOLEAN NOT NULL DEFAULT false, '
            + '  `is_geolocation_allowed` BOOLEAN NOT NULL DEFAULT false, '
            + '  `location` VARCHAR(255) , '
            + '  `id_gender` INT , '
            + '  `id_orientation` INT , '
            + '   UNIQUE (`username`),'
            + '   UNIQUE (`email`),'
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

// Create table containing user information
const picturesTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_pictures')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_pictures` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `picture` VARCHAR(255) NOT NULL , '
            + '  `is_profile_pic` BOOLEAN NOT NULL DEFAULT false, '
            + '   UNIQUE(picture),'
            + '   PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Profile pictures table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Profile pictures table has been created')
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
            + '  UNIQUE (gender),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Gender table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Gender table has been created')
        return dbQuery(
          database,
          'INSERT INTO `users_gender` (`gender`) VALUES (\'male\'), (\'female\');'
        )
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Gender table has been filled')
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
            + '  UNIQUE (orientation),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Sexual orientation table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Sexual orientation table has been created')
        return dbQuery(
          database,
          'INSERT INTO `users_sexual_orientation` (`orientation`) VALUES (\'male\'), (\'female\');'
        )
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Sexual orientation table has been filled')
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
            + '  `token` VARCHAR(255) NOT NULL , '
            + '  `expiration_date` TIMESTAMP NOT NULL , '
            + '  UNIQUE (token),'
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

// Create table containing password recovery tokens sent by mail
const passwordRecoveryTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_password_recovery')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_password_recovery` '
            + '( '
            + '  `id` INT NOT NULL AUTO_INCREMENT , '
            + '  `user_id` INT NOT NULL , '
            + '  `token` VARCHAR(255) NOT NULL , '
            + '  `expiration_date` TIMESTAMP NOT NULL , '
            + '  UNIQUE (token),'
            + '  PRIMARY KEY (`id`)'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Password recovery table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Password recovery table has been created')
      })
      .catch(err => console.log(err))
  )
))

// Create table containing likes
const likesTable = new Promise(resolve => (
  resolve(
    tableExists(database, 'users_likes')
      .then((res) => {
        if (res === false) {
          return dbQuery(
            database,
            'CREATE TABLE `users_likes` '
            + '( '
            + '  `liker_id` INT NOT NULL , '
            + '  `liked_id` INT NOT NULL , '
            + '  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'
            + ') '
            + 'ENGINE = InnoDB;'
          )
        }
        return console.log('[mysql] Likes table already exists')
      })
      .then((res) => {
        if (!isEmpty(res)) console.log('[mysql] Likes table has been created')
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
            + '  `token` VARCHAR(255) NOT NULL , '
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
  authTable,
  usersTable,
  picturesTable,
  genderTable,
  orientationTable,
  interestsTable,
  registrationTable,
  passwordRecoveryTable,
  likesTable,
  blacklistTable,
]).then(() => {
  console.log('[mysql] Database is now up-to-date')
  process.exit() // eslint-disable-line
})
