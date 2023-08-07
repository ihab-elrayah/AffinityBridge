// db/db.js

const { Sequelize } = require('sequelize');
// the connection details with PostgreSQL database credentials
const sequelize = new Sequelize('AffinityBridge', 'postgres', 'Strawhats1', {
  host: 'localhost',
  dialect: 'postgres',
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;




