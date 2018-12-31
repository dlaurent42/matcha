const isEmpty = require('../obj/isEmpty')

const deg2rad = deg => deg * (Math.PI / 180)

/* This script calculates great-circle distances between the two points – that is,
the shortest distance over the earth’s surface – using the ‘Haversine’ formula. */

const getDistanceFromLatLonInKm = (user1, user2) => {
  const lat1 = user1.latitude
  const lon1 = user1.longitude
  const lat2 = user2.latitude
  const lon2 = user2.longitude
  if (isEmpty(lat1) || isEmpty(lon1) || isEmpty(lat2) || isEmpty(lon2)) return null
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
          * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

module.exports = getDistanceFromLatLonInKm
