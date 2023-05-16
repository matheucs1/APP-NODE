const DataTypes = require('sequelize');

const connection = new DataTypes('guiaperguntas','root','123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;
