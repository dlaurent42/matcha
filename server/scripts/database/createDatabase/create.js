const { db } = require('../../../src/config')

const create = database => (
  new Promise((resolve, reject) => (
    database.query(`CREATE DATABASE IF NOT EXISTS ${db.database};`, (err) => {
      if (err) reject(new Error('[mysql] Cannot create database: ', err.message))
      resolve()
    })
  ))
)

module.exports = create
