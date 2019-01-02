const router = require('express').Router()
const User = require('../../models/User')
const {
  isEmpty,
  userIsBirthdate,
  userIsFirstname,
  userIsLastname,
  userIsUsername,
  userIsEmail,
  userIsLatitude,
  userIsLongitude,
  userIsPassword,
} = require('../../utils')
const { ERRORS } = require('../../config/constants')

const verifyInput = (fields) => {
  let err = false
  const possibleFields = [
    'username',
    'firstname',
    'lastname',
    'email',
    'password',
    'birthday',
    'biography',
    'allowLocation',
    'latitude',
    'longitude',
    'gender',
    'sexualOrientation',
  ]
  Object.keys(fields).forEach((key, value) => {
    if (key === 'username' && !userIsUsername(value)) err = true
    if (key === 'firstname' && !userIsFirstname(value)) err = true
    if (key === 'lastname' && !userIsLastname(value)) err = true
    if (key === 'email' && !userIsEmail(value)) err = true
    if (key === 'password' && !userIsPassword(value)) err = true
    if (key === 'birthday' && !userIsBirthdate(value)) err = true
    if (key === 'biography' && isEmpty(value)) err = true
    if (key === 'allowLocation' && value !== true && value !== false) err = true
    if (key === 'latitude' && !userIsLatitude(value)) err = true
    if (key === 'longitude' && !userIsLongitude(value)) err = true
    if (key === 'gender' && isEmpty(value)) err = true
    if (key === 'sexualOrientation' && isEmpty(value)) err = true
    if (!possibleFields.includes(key)) err = true
  })
  return err
}

const fetchPromises = (userId, fields) => {
  const promises = []
  const user = new User()
  Object.keys(fields).forEach((key, value) => {
    if (key === 'password') promises.push(user.setPassword(userId, value))
    else if (key === 'firstname') promises.push(user.setGeneralInformation(userId, key, value.charAt(0).toUpperCase() + value.slice(1)))
    else if (key === 'lastname') promises.push(user.setGeneralInformation(userId, key, value.toUpperCase()))
    else if (key === 'gender') promises.push(user.setGender(userId, value))
    else if (key === 'sexualOrientation') promises.push(user.setSexualOrientation(userId, value))
    else promises.push(user.setGeneralInformation(userId, key, value))
  })
  return promises
}

router.put('/:id/', (req, res) => {
  if (isEmpty(req.body.fields)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  if (!verifyInput(req.body.fields)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  const promises = fetchPromises(req.params.id, req.body.fields)
  return Promise.all(promises)
    .then(() => new User().fetchInformationById(req.params.id))
    .then(updatedUser => res.json({ user: updatedUser }))
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
