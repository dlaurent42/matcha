const router = require('express').Router()

router.get('/', (req, res) => {
  const filter = JSON.parse(req.query.filters)
  console.log(filter.productType.x)
  res.sendStatus(200)
})

module.exports = router

// /Search?term=pumas&filters={"productType":["Clothing","Bags"],"color":["Black","Red"]}
