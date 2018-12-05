# Install and run phpmyadmin
docker run --name=mysql5 -e MYSQL_USER=root -e MYSQL_PASSWORD=password -d mysql/mysql-server:5.7 && \
docker run --name phpmyadmin5 -d --link mysql5:db -p 8080:80 phpmyadmin/phpmyadmin
docker start phpmyadmin5

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install database (serverside)
node scripts/database.js
