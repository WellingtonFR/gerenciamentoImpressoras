const { DataTypes } = require('sequelize');
const database = require("../db")

const Printers = database.define('Printers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    modelo: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    fabricante: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    tonner: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    unidadeImagem: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    kitManutencao: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    contador: {
        type: DataTypes.STRING,
        defaultValue: "-"
    }
}, {
    timestamps: true,
});

module.exports = Printers;
