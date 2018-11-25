module.exports = (app) => {
  app.get('/', (req, res) => {
    console.log('Index get', req, res)
    res.end()
  })
  app.post('/', (req, res) => {
    console.log('Index post', req, res)
    res.end()
  })
}
