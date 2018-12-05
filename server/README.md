# MATCHA API

## /user

|TYPE|URL|PARAMETERS (*) |RETURN (**)|DESCRIPTION|
|:-:|:-:|:-:|:-:|:-:|
|GET|/{id}|-| { user } | Return all information relative to user id except identification token.|
|POST|/add|username<br>firstname<br>lastname<br>email<br>password<br>cpassword| { user }| Create a new user account and return all information relative to new user.<br>Identification token is contained in returned object.<br>An email is sent to user with registration token.|
|GET|/count|-| count | Return number of registered users|
|GET|/credentials|-|{ user }|Check if an identification token exists and refresh it with most up-to-date user information.<br> A new identification token is generated and contained in returned object. <br>Old identification token is added to blacklist|
|POST|/credentials|username<br>password|{ user }|Return user information and an identification token if credentials are correct.|
|POST|/logout|-|-|Add identification token to blacklist|

\* if specified, parameters are contained in an object named `user`<br>
\** in case of error, `err` is returned
