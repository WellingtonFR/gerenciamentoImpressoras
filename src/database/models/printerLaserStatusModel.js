const { DataTypes } = require('sequelize');
const database = require("../db");

const PrinterLaserStatusModel = database.define('PrinterLaserStatus', {
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
    rede: {
        type: DataTypes.STRING,
        defaultValue: "Offline"
    },
    modelo: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    serial: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    fabricante: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    toner: {
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

module.exports = PrinterLaserStatusModel;
