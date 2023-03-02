const DataTypes = require('sequelize');

const connection = new DataTypes('guiaperguntas','root','Ma628387', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;