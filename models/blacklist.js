// models/blacklist.js

const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db/db');

const Blacklist = db.define('Blacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  blacklistedToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
});

module.exports = Blacklist;


/*

agination in Posts and Comments:
To add pagination, you can modify the route handlers to accept query parameters like page and limit and use them to paginate the results.
User Can Create Their Username:
You can extend the User model to include a username field, update the registration route to accept a username, and update the user profile update route accordingly.


*/