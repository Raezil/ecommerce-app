const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,       // Example tweak for higher concurrency
      min: 1,
      acquire: 30000,
      idle: 10000
    }
  }
);


module.exports = {
  sequelize,
}