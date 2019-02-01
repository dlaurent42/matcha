const isEmpty = require('../obj/isEmpty')
const { BOUNDARY_VALUES } = require('../../config/constants')
const { FACTORS } = require('../../config/constants').MATCHING_SYSTEM

/*
  Gender score is a boolean assessed as follow:
    If sexual orientation or gender of a user is not set, score is 0
    If there is not a full match beetween gender and sexual orientation, score is 0
    Else score is 1
*/
const getGenderScore = (user1, user2) => {
  if (isEmpty(user1.orientation) || isEmpty(user2.orientation)
  || isEmpty(user1.gender) || isEmpty(user2.gender)
  || user1.orientation.indexOf(user2.gender) !== 0
  || user2.orientation.indexOf(user1.gender) !== 0) {
    return 0
  }
  return 1
}

/*
  Distance score is assessed using the following formula:
    f(x) = exp(-0.1 * distance)
  Consequently, the score decreases as the distance increases
*/
const getDistanceScore = distance => Math.exp(FACTORS.DISTANCE_CONSTANT * distance)

/*
  Interests score is assessed using the following formula:
    f(x) = 1 - exp(-n)
  where n is the number of common interests of users
*/
const getInterestsScore = n => 1 - Math.exp(FACTORS.INTERESTS_CONSTANT * n)

/*
  Popularity score is assessed considering percentage of popularity in comparison of max
*/
const getPopularityScore = popularity => popularity / BOUNDARY_VALUES.POPULARITY_MAX

const getMatchingScore = (user1, user2) => {
  const genderScore = getGenderScore(user1, user2)
  const distanceScore = getDistanceScore(user2.distance)
  const interestsScore = getInterestsScore(user2.commonInterestsNumber)
  const popularityScore = getPopularityScore(user2.popularity)
  const matchingScore = genderScore
  * (distanceScore * FACTORS.DISTANCE_IMPORTANCE
    + interestsScore * FACTORS.INTERESTS_IMPORTANCE
    + popularityScore * FACTORS.POPULARITY_IMPORTANCE)
  / (FACTORS.DISTANCE_IMPORTANCE + FACTORS.INTERESTS_IMPORTANCE + FACTORS.POPULARITY_IMPORTANCE)
  return matchingScore * 100
}

module.exports = getMatchingScore
