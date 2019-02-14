const template = require('../utils/string/interpolation')

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
    UNBLOCK: 100,
  },
}

const BOUNDARY_VALUES = {
  AGE_MIN: 18,
  AGE_MAX: 99,
  POPULARITY_MIN: 0,
  POPULARITY_MAX: 5000,
  EMAIL_MAX_LEN: 255,
  NAME_MIN_LEN: 5,
  NAME_MAX_LEN: 25,
  PASS_MIN_LEN: 8,
}

const QUERIES = {
  AUTH: {
    ADD_CREDENTIALS: 'INSERT INTO `auth` (`user_id`, `client_id`, `client_secret`) VALUES (?, ?, ?);',
    GET_TOKEN: 'SELECT COUNT(*) as count FROM `auth` WHERE `client_id` = ? AND `client_secret` = ?;',
    GET_CREDENTIALS: 'SELECT `client_id`, `client_secret` FROM `auth` WHERE `user_id` = ?;',
  },
  CHAT: {
    ADD_MESSAGE: 'INSERT INTO `users_messages` (`owner_id`, `with_id`, `emitter_id`, `receiver_id`, `content`) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);',
    DELETE_CONVERSATION: 'DELETE FROM `users_messages` WHERE `owner_id` = ? AND `with_id` = ? ;',
    DELETE_CONVERSATIONS: 'DELETE FROM `users_messages` WHERE `owner_id` = ?;',
    GET_CONVERSATIONS: [
      'SELECT',
      '   o.*,',
      '   users.username',
      'FROM users_messages o',
      'LEFT JOIN users_messages b ON o.with_id = b.with_id AND o.creation < b.creation',
      'LEFT JOIN users ON o.with_id = users.id',
      'WHERE b.creation is NULL AND o.owner_id = ?',
      'ORDER BY b.creation DESC;',
    ].join(' '),
    GET_MESSAGES: [
      'SELECT',
      '  users_messages.id,',
      '  users_messages.emitter_id,',
      '  a.username AS \'emitter\',',
      '  users_messages.receiver_id,',
      '  b.username AS \'receiver\',',
      '  users_messages.content,',
      '  users_messages.creation',
      'FROM users_messages',
      'LEFT JOIN users a ON users_messages.emitter_id = a.id',
      'LEFT JOIN users b ON users_messages.receiver_id = b.id',
      'WHERE owner_id = ? AND with_id = ?',
      'ORDER BY creation DESC;',
    ].join(' '),
  },
  INTERESTS: {
    GET_TAGS: 'SELECT DISTINCT `tag` FROM `users_interests` ORDER BY `tag`',
  },
  JSON_WEB_TOKEN: {
    ADD_BLACKLIST: 'INSERT INTO `tokens_blacklist` (`token`) VALUES (?);',
    GET: 'SELECT COUNT(*) AS count FROM `tokens_blacklist` WHERE `token` = ?;',
  },
  NOTIFICATIONS: {
    ADD_DISLIKE: 'INSERT INTO `users_notifications` (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'unlike\');',
    ADD_LIKE: 'INSERT INTO `users_notifications` (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, ?);',
    ADD_MATCH: 'INSERT INTO `users_notifications` (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'match\');',
    ADD_MESSAGE: 'INSERT INTO `users_notifications` (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'message\');',
    ADD_PROFILE_VIEW: 'INSERT INTO `users_notifications` (`emitter_id`, `receiver_id`, `type`) VALUES (?, ?, \'view\');',
    DELETE_LIKE: 'DELETE FROM `users_notifications` WHERE `emitter_id` = ? AND `receiver_id` = ? AND (`type` = \'like\' OR `type` = \'match\');',
    DELETE_UNLIKE: 'DELETE FROM `users_notifications` WHERE `emitter_id` = ? AND `receiver_id` = ? AND (`type` = \'unlike\');',
    DELETE_NOTIFICATION: 'DELETE FROM `users_notifications` WHERE `id` = ?;',
    DELETE_NOTIFICATIONS: 'DELETE FROM `users_notifications` WHERE `receiver_id` = ?;',
    GET_ALL: [
      'SELECT',
      '   users_notifications.id,',
      '   users.username,',
      '   users_notifications.emitter_id,',
      '   users_notifications.type,',
      '   users_notifications.is_opened,',
      '   users_notifications.creation',
      'FROM users_notifications',
      'LEFT JOIN users ON users.id = users_notifications.emitter_id',
      'WHERE users_notifications.receiver_id = ?',
      'ORDER BY users_notifications.creation DESC;',
    ].join(' '),
    GET_LIKE: 'SELECT COUNT(*) AS count FROM `users_likes` WHERE `liker_id` = ? AND `liked_id` = ?;',
    SET_VIEWED: 'UPDATE `users_notifications` SET `is_opened` = 1 WHERE `id` = ?;',
    SET_ALL_VIEWED: 'UPDATE `users_notifications` SET `is_opened` = 1 WHERE `receiver_id` = ?;',
  },
  USERS: {
    ADD_BLOCK: 'INSERT INTO `users_blocked` (`blocker_id`, `blocked_id`) VALUES (?, ?);',
    ADD_INTERESTS: 'INSERT INTO `users_interests` (`user_id`, `tag`) VALUES (?, ?);',
    ADD_LIKE: 'INSERT INTO `users_likes` (`liker_id`, `liked_id`) VALUES (?, ?);',
    ADD_PICTURE: 'INSERT INTO `users_pictures` (`user_id`, `filename`, `is_profile_pic`) VALUES (?, ?, ?);',
    ADD_PASSWORD_RECOVERY_TOKEN: 'INSERT INTO `users_password_recovery` (`token`, `user_id`, `expiration_date`) VALUES (?, ?, NOW() + INTERVAL 1 DAY);',
    ADD_REGISTRATION_INFO: 'INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`, `password`, `salt`) VALUES (?, ?, ?, ?, ?, ?);',
    ADD_REGISTRATION_TOKEN: 'INSERT INTO `users_registration` (`token`, `user_id`, `expiration_date`) VALUES (?, ?, NOW() + INTERVAL 1 DAY);',
    ADD_REPORT: 'INSERT INTO `users_fakes` (`reporter_id`, `reported_id`) VALUES (?, ?);',
    ADD_SEXUAL_ORIENTATION: 'INSERT INTO `users_sexual_orientation` (`user_id`, `gender_id`) VALUES (?, (SELECT `users_gender`.`id` FROM `users_gender` WHERE `users_gender`.`gender` IN (?)));',
    DELETE_USER: {
      USER: 'DELETE FROM `users` WHERE `id` = ? LIMIT 1;',
      BLOCKED: 'DELETE FROM `users_blocked` WHERE `blocker_id` = ? OR `blocked_id` = ?;',
      INTERESTS: 'DELETE FROM `users_interests` WHERE `user_id` = ?;',
      LIKES: 'DELETE FROM `users_likes` WHERE `liker_id` = ? OR `liked_id` = ?;',
      MESSAGES: 'DELETE FROM `users_messages` WHERE `emitter_id` = ? OR `receiver_id` = ?;',
      NOTIFICATIONS: 'DELETE FROM `users_notifications` WHERE `receiver_id` = ?;',
      PASS_RECOVERY: 'DELETE FROM `users_password_recovery` WHERE `user_id` = ?;',
      PICTURES: 'DELETE FROM `users_pictures` WHERE `user_id` = ?;',
      REGISTRATION: 'DELETE FROM `users_registration` WHERE `user_id` = ?;',
      SEXUAL_ORIENTATION: 'DELETE FROM `users_sexual_orientation` WHERE `user_id` = ?;',
    },
    DELETE_BLOCK: 'DELETE FROM `users_blocked` WHERE `blocker_id` = ? AND `blocked_id` = ? LIMIT 1;',
    DELETE_LIKE: 'DELETE FROM `users_likes` WHERE `liker_id`= ? AND `liked_id` = ? ;',
    DELETE_PICTURE: 'DELETE FROM `users_pictures` WHERE `user_id` = ? AND `filename` = ? LIMIT 1;',
    DELETE_REGISTRATION_TOKEN: 'DELETE FROM `users_registration` WHERE `token` = ?',
    GET_ALL_USERS: [
      'SELECT',
      '   users.id,',
      '   users.username,',
      '   users.firstname,',
      '   users.lastname,',
      '   DATE_FORMAT(users.birthday, "%Y/%m/%d") AS birthday,',
      '   users.popularity,',
      '   users.latitude,',
      '   users.longitude,',
      '   users.is_connected,',
      '   DATE_FORMAT(users.last_connection, "%Y/%m/%d %T") AS last_connection, ',
      '   users_gender.gender,',
      '   orientations.orientation,',
      '   interests.interests,',
      '   likes.liker_id,',
      '   profile_pictures.profile_pic ',
      'FROM',
      '   users',
      'LEFT JOIN users_gender ON users_gender.id = users.id_gender',
      'LEFT JOIN (',
      '   SELECT users_sexual_orientation.user_id, GROUP_CONCAT(DISTINCT users_gender.gender) AS orientation',
      '   FROM users_sexual_orientation',
      '   LEFT JOIN users_gender ON users_gender.id = users_sexual_orientation.gender_id',
      '   GROUP BY users_sexual_orientation.user_id',
      ') AS orientations ON orientations.user_id = users.id ',
      'LEFT JOIN  ( ',
      '   SELECT users_interests.user_id, GROUP_CONCAT(DISTINCT users_interests.tag ORDER BY users_interests.tag) AS interests',
      '   FROM users_interests',
      '   GROUP BY users_interests.user_id ',
      ') AS interests ON interests.user_id = users.id ',
      'LEFT JOIN ( ',
      '   SELECT users_pictures.user_id, users_pictures.filename AS profile_pic',
      '   FROM users_pictures',
      '   WHERE users_pictures.is_profile_pic = 1 ',
      ') AS profile_pictures ON profile_pictures.user_id = users.id ',
      'LEFT JOIN ( ',
      '   SELECT users_likes.liker_id',
      '   FROM users_likes',
      '   WHERE users_likes.liked_id = ?',
      ') AS likes ON likes.liker_id = users.id ',
      'WHERE ',
      '   users.is_profile_complete = 1 ',
      ' AND',
      '   users.is_account_confirmed = 1 ',
      ' AND',
      '   NOT users.id = ? ',
      ' AND',
      '   users.id NOT IN (',
      '     SELECT users_blocked.blocked_id ',
      '     FROM users_blocked',
      '     WHERE users_blocked.blocker_id = ? ',
      '   )',
      ' AND',
      '   users.id NOT IN (',
      '     SELECT users_blocked.blocker_id',
      '     FROM users_blocked',
      '     WHERE users_blocked.blocked_id = ? ',
      '   )',
      'ORDER BY users.id;'].join(' '),
    GET_BLOCK: 'SELECT COUNT(*) AS count FROM `users_blocked` WHERE `blocker_id` = ? AND `blocked_id` = ? ;',
    GET_GENDERS: 'SELECT `gender` FROM `users_gender` ORDER BY gender ASC;',
    GET_LIKE: 'SELECT COUNT(*) AS count FROM `users_likes` WHERE `users_likes`.`liker_id` = ? AND `users_likes`.`liked_id` = ?;',
    GET_LIKES: [
      'SELECT * FROM `users_likes` LEFT JOIN `users` ON `users_likes`.`liker_id` = `users`.`id` WHERE `users_likes`.`liked_id` = ? ORDER BY `users_likes`.`date` DESC ;',
      'SELECT * FROM `users_likes` LEFT JOIN `users` ON `users_likes`.`liked_id` = `users`.`id` WHERE `users_likes`.`liker_id` = ? ORDER BY `users_likes`.`date` DESC ;',
    ],
    GET_PASSWORD_RECOVERY_TOKEN: 'SELECT `user_id` FROM `users_password_recovery` WHERE `token` = ? AND `expiration_date` > NOW();',
    GET_PICTURES: 'SELECT `filename`, `is_profile_pic`, `import` FROM `users_pictures` WHERE `user_id` = ? ORDER BY `is_profile_pic` DESC, `import` DESC;',
    GET_REGISTRATION_TOKEN: 'SELECT `user_id` FROM `users_registration` WHERE `token` = ? AND `expiration_date` > NOW();',
    GET_USER_BY_CONDITION:
      template`SELECT \
        users.id, \
        users.username, \
        users.firstname, \
        users.lastname, \
        users.email, \
        users.salt, \
        users.password, \
        DATE_FORMAT(users.creation, "%Y/%m/%d %T") AS creation, \
        DATE_FORMAT(users.birthday, "%Y/%m/%d") AS birthday, \
        users.popularity, \
        users.biography, \
        users.last_connection, \
        users.is_account_confirmed, \
        users.is_profile_complete, \
        users.is_geolocation_allowed, \
        users.latitude, \
        users.longitude, \
        users_gender.gender, \
        orientations.orientation, \
        users_registration.token, \
        interests.interests \
      FROM users \
      LEFT JOIN users_gender ON users_gender.id = users.id_gender \
      LEFT JOIN ( \
        SELECT \
          users_sexual_orientation.user_id, \
          GROUP_CONCAT(DISTINCT users_gender.gender) AS orientation \
        FROM users_sexual_orientation \
        LEFT JOIN users_gender ON users_gender.id = users_sexual_orientation.gender_id \
        GROUP BY users_sexual_orientation.user_id \
      ) AS orientations ON orientations.user_id = users.id \
      LEFT JOIN  ( \
        SELECT \
          users_interests.user_id, \
          GROUP_CONCAT(DISTINCT users_interests.tag ORDER BY users_interests.tag) AS interests \
          FROM users_interests \
          GROUP BY users_interests.user_id \
      ) AS interests ON interests.user_id = users.id \
      LEFT JOIN users_registration ON users_registration.user_id = users.id \
      WHERE users.${'condition'} = ? \
      ORDER BY users_registration.expiration_date DESC;`,
    GET_COUNT_BY_USERNAME_AND_EMAIL: 'SELECT COUNT(*) AS count FROM `users` WHERE `username` = ? OR `email` = ? LIMIT 1;',
    GET_USERNAME_AND_EMAIL: 'SELECT `username`, `email` FROM `users` WHERE `id` = ?;',
    SET_ACCOUNT_CONFIRMED: 'UPDATE `users` SET `is_account_confirmed` = 1 WHERE `id` = ?;',
    SET_DISCONNECTED: 'UPDATE `users` SET `is_connected` = 0, `last_connection` = NOW() WHERE `id` = ?;',
    SET_GENDER: 'UPDATE `users` SET `users`.`id_gender` = (SELECT `users_gender`.`id` FROM `users_gender` WHERE `users_gender`.`gender` = ?) WHERE `users`.`id` = ?;',
    SET_GENERAL_INFO: 'UPDATE `users` SET ?? = ? WHERE `id` = ?;',
    SET_LESS_POPULARITY: 'UPDATE `users` SET `users`.`popularity` = IF (`users`.`popularity` - ? <= ?, ?, `users`.`popularity` - ?) WHERE `users`.`id` = ?;',
    SET_MORE_POPULARITY: 'UPDATE `users` SET `users`.`popularity` = IF (`users`.`popularity` + ? >= ?, ?, `users`.`popularity` + ?) WHERE `users`.`id` = ?;',
    SET_PASSWORD: 'UPDATE `users` SET `salt` = ?, `password` = ? WHERE `id` = ?;',
    SET_PROFILE_PICTURE: 'UPDATE `users_pictures` SET `is_profile_pic` = ? WHERE `filename` = ?;',
  },
}

const RESPONSES = {
  ERRORS: {
    GENERAL: 'An error occured. Please try again later.',
    DATA_MISSING: 'One or more arguments are missing.',
    DATA_VALIDATION: 'Data validation has failed.',
    AUTH_CREDENTIALS: 'Credentials are invalid.',
    JWT_CREATION: 'Cannot create new token.',
    JWT_TOKEN_IN_BLACKLIST: 'Token has been blacklisted.',
    USER_ACCOUNT_ACTIVATED: 'Account has already been activated.',
    USER_ACCOUNT_EXISTS: 'An account with entered email/username already exists.',
    USER_BLOCK: 'User already blocked.',
    USER_NOT_BLOCK: 'User not blocked.',
    USER_FETCH_LIKES: 'Cannot fetch user likes.',
    USER_FETCH_PICTURES: 'Cannot fetch user pictures.',
    USER_LIKE: 'User already liked.',
    USER_NOT_LIKE: 'User not liked.',
    USER_PASSWD: 'Incorrect password.',
    USER_MIN_PICTURES: 'Minimum number of pictures is one.',
    USER_MAX_PICTURES: 'Maximum number of pictures reached.',
    USER_NO_USER: 'No user found.',
    USER_PICTURE_FILENAME: 'Wrong filename.',
    USER_TOKEN_EXPIRED: 'Token is incorrect or has expired.',
    USER_WRONG_PASSWORD: 'Wrong current password.',
  },
}

module.exports = {
  MATCHING_SYSTEM,
  BOUNDARY_VALUES,
  QUERIES,
  RESPONSES,
}
