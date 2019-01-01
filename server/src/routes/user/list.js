const router = require('express').Router()
const User = require('../../models/User')
const {
  dynamicSort,
  isEmpty,
  userNumberOfCommonInterests,
  userGetDistFromCoord,
  userGetMatchingScore,
} = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

// Override each user information with distance, number of common interests and matching score
const overrideUsers = (users, currentUser) => (
  users.map((user) => {
    Object.assign(user, {
      distance: userGetDistFromCoord(currentUser, user),
      commonInterestsNumber: userNumberOfCommonInterests(currentUser, user),
    })
    Object.assign(user, { matchingScore: userGetMatchingScore(currentUser, user) })
    return user
  })
)

// Sort users by 'matching_score' (default value), 'age', 'distance', 'popularity' or 'interests'
const sortUsers = (users, param) => {
  if (isEmpty(users) || isEmpty(param)) return users
  switch (param) {
    case 'age':
      return users.sort(dynamicSort('age'))
    case 'distance':
      return users.sort(dynamicSort('distance'))
    case 'popularity':
      return users.sort(dynamicSort('-popularity'))
    case 'interests':
      return users.sort(dynamicSort('-commonInterestsNumber'))
    default:
      return users.sort(dynamicSort('-matchingScore'))
  }
}

const filterUsers = (users, params) => {
  if (isEmpty(users) || isEmpty(params)) return users
  const filters = JSON.parse(params)
  return users.filter((user) => {
    if (!isEmpty(filters.age_min) && (isEmpty(user.age) || user.age < filters.age_min)) return false
    if (!isEmpty(filters.age_max) && (isEmpty(user.age) || user.age > filters.age_max)) return false
    if (!isEmpty(filters.distance_min) && (isEmpty(user.distance) || user.distance < filters.distance_min)) return false // eslint-disable-line max-len
    if (!isEmpty(filters.distance_max) && (isEmpty(user.distance) || user.distance > filters.distance_max)) return false // eslint-disable-line max-len
    if (!isEmpty(filters.popularity_min) && (isEmpty(user.popularity) || user.popularity < filters.popularity_min)) return false // eslint-disable-line max-len
    if (!isEmpty(filters.popularity_max) && (isEmpty(user.popularity) || user.popularity > filters.popularity_max)) return false // eslint-disable-line max-len
    if (!isEmpty(filters.interests)) {
      if (isEmpty(user.interests)) return false
      let interestsMatch = true
      filters.interests.forEach((interest) => {
        if (!user.interests.includes(interest) || interestsMatch === false) {
          interestsMatch = false
        }
      })
      return interestsMatch
    }
    return true
  })
}

router.get('/', (req, res) => {
  if (isEmpty(req.query.user_id)) return res.status(400).json({ err: ERRORS.DATA_MISSING })
  return new User().fetchAll(req.query.user_id)
    .then(({ users, currentUser }) => {
      const overrideUsersArr = overrideUsers(users, currentUser)
      const filteredUsersArr = filterUsers(overrideUsersArr, req.query.filters)
      const sortedUsersArr = sortUsers(filteredUsersArr, req.query.sort)
      return res.json(sortedUsersArr)
    })
    .catch(err => res.json({ err: err.message }))
})

module.exports = router

/*
 How to use this route
    /
    ? filters=
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
