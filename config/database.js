const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306, // Default MySQL port
    }
);

sequelize
    .authenticate()
    .then(() => console.log('MySQL connected'))
    .catch((error) => console.log('Unable to connect to MySQL:', error));

module.exports = sequelize;
