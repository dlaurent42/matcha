const Database = require('./Database')
const { INTERESTS } = require('../config/constants').QUERIES

class Interest {
  constructor() {
    this.database = new Database()
    this.tags = []
  }

  list() {
    return new Promise((resolve, reject) => (
      this.database.query(INTERESTS.GET_TAGS, [])
        .then((tags) => {
          Object.keys(tags).forEach((key) => { this.tags.push(tags[key].tag) })
          return resolve(this.tags)
        })
        .catch(err => reject(err))
    ))
  }
}

module.exports = Interest
