const router = require('express').Router()

router.delete('/delete', (req, res) => {
  res.sendStatus(200)
})

module.exports = router
