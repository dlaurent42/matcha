const { DATABASE } = require('../../../src/config/config')

const create = database => (
  new Promise((resolve, reject) => (
    database.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE.NAME};`, (err) => {
      if (err) reject(new Error('[mysql] Cannot create database: ', err.message))
      resolve()
    })
  ))
)

module.exports = create
