const { DataTypes } = require('sequelize');
const database = require("../db")

const Printers = database.define('Printers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nomeFila: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enderecoFila: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});

module.exports = Printers;
