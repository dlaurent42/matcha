const port = process.env.PORT || 8081
const db = {
  database: process.env.DB_NAME || 'matcha',
  host: process.env.DB_HOST || 'matcha',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'passwd',
}

module.exports = { port, db }
