const router = require('express').Router()
const multer = require('multer')
const User = require('../../models/User')
const { isEmpty, random } = require('../../utils')

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true)
  else cb(null, false)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/assets/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${random(60)}.${file.originalname.split('.').pop()}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
})

router.post('/import', upload.single('picture'), (req, res) => {
  if (isEmpty(req.file)) return res.status(400).send({ err: 'Wrong file import.' })
  if (isEmpty(req.body.user_id)) res.status(400).send({ err: 'Missing argument.' })
  return new User().addPicture(req.file, req.body.user_id)
    .then(user => res.json({ user }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
