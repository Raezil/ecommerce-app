// models/user.js
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  PasswordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false,
});

// Hash password before creating a user
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.PasswordHash = await bcrypt.hash(user.PasswordHash, salt);
});

module.exports = { User };
