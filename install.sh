# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install database (serverside)
node scripts/database/index.js
