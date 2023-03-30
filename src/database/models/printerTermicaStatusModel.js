const { DataTypes } = require('sequelize');
const database = require("../db");

const PrinterTermicaStatusModel = database.define('PrinterTermicaStatus', {
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
    serial: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    modelo: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    fabricante: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    contador: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    velocidade: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    tonalidade: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    largura_etiqueta: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    metodo_impressao: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    tipo_sensor: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    rede_conectada: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    status_cabeca: {
        type: DataTypes.STRING,
        defaultValue: "-"
    },
    status_pause: {
        type: DataTypes.STRING,
        defaultValue: "-"
    }
}, {
    timestamps: true,
});

module.exports = PrinterTermicaStatusModel;
