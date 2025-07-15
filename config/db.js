const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false // Disable SQL logging for cleaner output
});

module.exports = {
  sequelize,
}