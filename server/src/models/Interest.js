const Database = require('./Database')

class Interest {
  constructor() {
    this.database = new Database()
    this.tags = []
  }

  list() {
    return new Promise((resolve, reject) => (
      this.database.query('SELECT DISTINCT `tag` FROM `users_interests` ORDER BY `tag`', [])
        .then((tags) => {
          Object.keys(tags).forEach((key) => {
            console.log(tags[key].tag)
            this.tags.push(tags[key].tag)
          })
          return resolve(this.tags)
        })
        .catch(err => reject(err))
    ))
  }
}

module.exports = Interest
