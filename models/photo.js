// models/ photos.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Photo extends Model {}
Photo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Photo',
    timestamps: false, 
  }
);

module.exports = Photo;



