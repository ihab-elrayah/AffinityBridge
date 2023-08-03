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







/*
const {Client} = require('pg')

const client = new Client({
  host: 'localhost', // Your database host (e.g., 'localhost')
  port: 5432, // Your database port (e.g., 5432)
  database: 'AffinityBridge', // Your database name
  user: 'postgres', // Your PostgreSQL username
  password: 'Strawhats1', // Your PostgreSQL password
})

client.connect();

client.query(`Select * from users`, (err, res)=>{
  if(!err){
    console.log(res.rows)
  } else {
    console.log(err.message);
  }
  client.end;
})
*/
/*
// Test the database connection
async function testDatabaseConnection() {
  try {
    await db.one('SELECT 1 AS result');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testDatabaseConnection();

  */