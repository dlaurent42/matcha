const MATCHING_SYSTEM = {
  FACTORS: {
    DISTANCE_IMPORTANCE: 3,
    DISTANCE_CONSTANT: -0.001,
    INTERESTS_IMPORTANCE: 2,
    INTERESTS_CONSTANT: -1,
    POPULARITY_IMPORTANCE: 2,
  },
  POPULARITY_POINTS: {
    PROFILE_VIEW: 15,
    LIKE: 50,
    UNLIKE: 50,
    BLOCK: 100,
  },
}

const BOUNDARY_VALUES = {
  AGE_MIN: 18,
  AGE_MAX: 99,
  POPULARITY_MIN: 0,
  POPULARITY_MAX: 5000,
}

const QUERIES = {
  AUTH: {
    GET_TOKEN: 'SELECT COUNT(*) as count FROM `auth` WHERE `clientId` = ? AND `clientSecret` = ?;',
  },
  CHAT: {
    ADD_MESSAGE: 'INSERT INTO `users_messages` (`owner_id`, `with_id`, `emitter_id`, `receiver_id`, `content`) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);',
    GET_MESSAGES:
    '  SELECT '
    + '  `users_messages`.`id`, '
    + '  `users_messages`.`emitter_id`, '
    + '  `a`.`username` AS \'emitter\', '
    + '  `users_messages`.`receiver_id`, '
    + '  `b`.`username` AS \'receiver\', '
    + '  `users_messages`.`content`, '
    + '  `users_messages`.`creation` '
    + 'FROM `users_messages` '
    + 'LEFT JOIN `users` a ON `users_messages`.`emitter_id` = a.`id`'
    + 'LEFT JOIN `users` b ON `users_messages`.`receiver_id` = b.`id`'
    + 'WHERE `owner_id` = ? AND `with_id` = ? '
    + 'ORDER BY `creation` DESC;',
  },
}

const RESPONSES = {
  ERRORS: {
    GENERAL: 'An error occured. Please try again later.',
    DATA_MISSING: 'One or more arguments are missing.',
    DATA_VALIDATION: 'Data validation has failed.',
    AUTH_CREDENTIALS: 'Credentials are invalid.',
  },
}

module.exports = {
  MATCHING_SYSTEM,
  BOUNDARY_VALUES,
  QUERIES,
  RESPONSES,
}
