const router = require('express').Router()
const User = require('../../models/User')
const { isEmpty } = require('../../utils')

router.get('/', (req, res) => {
  const filter = (isEmpty(req.query.filters)) ? [] : JSON.parse(req.query.filters)
  const orderBy = (isEmpty(req.query.order)) ? [] : JSON.parse(req.query.order)
  console.log(`User id: ${req.query.user_id}`)
  console.log(`Filters: ${filter}`)
  console.log(`OrderBy: ${orderBy}`)
  if (isEmpty(req.query.user_id)) return res.status(400).send({ err: 'Missing argument.' })
  return new User().fetchAll(req.query.user_id)
    .then((users) => {
      console.log('List of users has been obtained, now need to parse.')
      return res.json(users)
    })
    .catch(err => res.json({ err: err.message }))
})

module.exports = router
/*
 How to use this route
    /
    ? term=Alexandra
    & filters=
      {
        "age_min": 18,
        "age_max": 25,
        "distance_min": 0,
        "distance_max": 10,
        "popularity_min": 100,
        "popularity_max": 250,
        "interests": [
          'surf',
          'music',
        ]
      }
    & sort=age

    sort possible values:
      - matching_score (=default value)
      - age
      - proximity
      - popularity
      - interests (number of common interests)

    Matching system is based on sexual orientation, proximity, interests, popularity:
      sexual orientation = 0 or 1
      distance score = exp(-0.1 * distance)
      interests score = 1 - exp(number_of_interests * -1)
      popularity score = popularity / max_popularity
      -> matching score = weighted average of scores
*/
