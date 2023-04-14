const snmp = require('snmp-native');

let oid_serial = ".1.3.6.1.2.1.43.5.1.1.17.1"
let oid_modelo = ".1.3.6.1.2.1.43.5.1.1.16.1"
let oid_fabricante = ".1.3.6.1.2.1.43.8.2.1.14.1.1"
let oid_toner = ".1.3.6.1.2.1.43.11.1.1.9.1.1"
let oid_kitManutencao = ".1.3.6.1.2.1.43.11.1.1.9.1.2"
let oid_contador = ".1.3.6.1.2.1.43.10.2.1.4.1.1"

module.exports = async function HPInfo(ip, nome) {

    let enderecoFila = ""
    let nomeFila = ""
    let serial = ""
    let modelo = ""
    let fabricante = ""
    let toner = ""
    let kitManutencao = ""
    let contador = ""
    let rede = ""

    try {
        var session = new snmp.Session({ host: ip, port: 161, community: 'public', timeouts: [2000, 2000, 2000] });
    } catch (error) {
        console.log("Erro ao abrir sessao honeywell" + error);
    }

    enderecoFila = ip;
    nomeFila = nome;

    const save_toner = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_toner, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    if (data[0].value > 100) {
                        toner = 100;
                    } else if (data[0].value < 0) {
                        toner = 0;
                    } else {
                        toner = data[0].value;
                    }

                    resolve();
                }
            })
        })
    }

    const save_kitManutencao = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_kitManutencao, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    if (data[0].value == "noSuchInstance") {
                        kitManutencao = "-";
                    } else if (data[0].value > 100) {
                        kitManutencao = 100;
                    } else if (data[0].value < 0) {
                        kitManutencao = 0;
                    } else {
                        kitManutencao = data[0].value;
                    }

                    resolve();
                }
            })
        })
    }

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

    await save_toner();
    await save_kitManutencao();
    await save_contador();
    await save_modelo();
    await save_serial();
    await save_fabricante();

    let hpInfo = {
        enderecoFila,
        nomeFila,
        rede,
        toner,
        kitManutencao,
        contador,
        modelo,
        serial,
        fabricante
    };

    session.close();
    return hpInfo;

}