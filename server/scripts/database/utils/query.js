const query = (database, sql, args) => (
  new Promise((resolve, reject) => {
    database.query(sql, args, (err, rows) => {
      if (err) return reject(err.message)
      return resolve(rows)
    })
  })
)

module.exports = query
