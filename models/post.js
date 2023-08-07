// models/post.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // the path to the db.js file
const Photo = require('./photo'); 

class Post extends Model {}
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

// Add a one-to-many association with the "photos" table
Post.hasMany(Photo, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Post;














