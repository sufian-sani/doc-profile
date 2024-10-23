const { Sequelize } = require('sequelize');
require('dotenv').config();

const path = require('path'); // To specify the SQLite database path

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // SQLite database file location
    logging: false, // Disable logging SQL queries (optional)
});

sequelize
    .authenticate()
    .then(() => console.log('SQLite connected'))
    .catch((error) => console.log('Unable to connect to SQLite:', error));

module.exports = sequelize;
