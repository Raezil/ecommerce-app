const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Product = sequelize.define(
  'Product',
  {
    // Model attributes are defined here
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false // Disable createdAt and updatedAt
  }
);

module.exports = { Product };