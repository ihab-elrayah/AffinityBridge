// models/comment.js

const { DataTypes } = require('sequelize');
const db = require('../db/db'); // Import your Sequelize instance

const Comment = db.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Associate Comment with User and Post models
Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'userId' });
  Comment.belongsTo(models.Post, { foreignKey: 'postId' });
};

module.exports = Comment;






/*




const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Import your sequelize instance

class Comment extends Model {}
Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Add any other fields you need for comments
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

// Associate Comment with Post
Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });




*/