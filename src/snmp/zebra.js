const snmp = require('snmp-native');

let oid_serial = ".1.3.6.1.4.1.10642.1.9.0"
let oid_modelo = ".1.3.6.1.2.1.1.5.0"
let oid_fabricante = ".1.3.6.1.4.1.10642.1.11.0"
let oid_contador = ".1.3.6.1.4.1.10642.200.17.0"
let oid_redeConectada = ".1.3.6.1.4.1.10642.20.6.1.12.0"
let oid_tonEscuro = ".1.3.6.1.4.1.10642.200.21.0"
let oid_tipoSensor = ".1.3.6.1.4.1.10642.200.8.0"

module.exports = async function zebraInfo(ip, nome) {

    let enderecoFila = ""
    let nomeFila = ""
    let serial = ""
    let modelo = ""
    let fabricante = ""
    let ton_escuro = ""
    let tipo_sensor = ""
    let contador = ""
    let rede_conectada = ""
    let rede = ""

    var session = new snmp.Session({ host: ip, port: 161, community: 'public' });

    enderecoFila = ip;
    nomeFila = nome;

    const save_contador = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_contador, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    contador = data[0].value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                    resolve();
                }
            })
        })
    }

    const save_modelo = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_modelo, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    modelo = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_serial = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_serial, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    serial = data[0].value;
                    rede = "Online"
                    resolve();
                }
            })
        })
    }

    const save_fabricante = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_fabricante, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    fabricante = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_tonEscuro = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_tonEscuro, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    ton_escuro = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_tipoSensor = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_tipoSensor, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    tipo_sensor = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_redeConectada = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_redeConectada, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    rede_conectada = data[0].value;
                    resolve();
                }
            })
        })
    }

    await save_toner();
    await save_kitManutencao();
    await save_contador();
    await save_modelo();
    await save_serial();
    await save_fabricante();
    await save_tonEscuro();
    await save_tipoSensor();
    await save_redeConectada();

    let hpInfo = {
        enderecoFila,
        nomeFila,
        rede,
        contador,
        modelo,
        serial,
        fabricante,
        ton_escuro,
        tipo_sensor,
        rede_conectada
    };

    session.close();
    return zebraInfo;

}