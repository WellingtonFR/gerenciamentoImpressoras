const snmp = require('snmp-native');

let oid_serial = ".1.3.6.1.4.1.10642.1.9.0"
let oid_modelo = ".1.3.6.1.4.1.10642.200.19.7.0"
let oid_fabricante = ".1.3.6.1.4.1.10642.1.1.0"
let oid_contador = ".1.3.6.1.4.1.10642.3.1.7.0"
let oid_velocidade = ".1.3.6.1.4.1.10642.6.5.0"
let oid_tonEscuro = ".1.3.6.1.4.1.10642.6.2.0"
let oid_larguraEtq = ".1.3.6.1.4.1.10642.8.4.0"
let oid_metodoImpressao = ".1.3.6.1.4.1.10642.2.10.4.1.0"
let oid_redeConectada = ".1.3.6.1.4.1.10642.20.6.1.12.0"
let oid_tipoSensor = ".1.3.6.1.4.1.10642.200.8.2.0"
let oid_statusCabeca = ".1.3.6.1.4.1.10642.2.1.1.0"
let oid_statusPause = ".1.3.6.1.4.1.11.2.3.9.1.1.2.1.0"

module.exports = async function zebraInfo(ip, nome) {

    let nomeFila = ""
    let enderecoFila = ""
    let serial = ""
    let rede = ""
    let modelo = ""
    let fabricante = ""
    let contador = ""
    let velocidade = ""
    let tonalidade = ""
    let largura_etiqueta = ""
    let metodo_impressao = ""
    let rede_conectada = ""
    let tipo_sensor = ""
    let status_cabeca = ""
    let status_pause = ""

    try {
        var session = new snmp.Session({ host: ip, port: 161, community: 'public', timeouts: [2000, 2000, 2000] });
    } catch (error) {
        console.log("Erro ao abrir sessao honeywell" + error);
    }

    enderecoFila = ip;
    nomeFila = nome;

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

    const save_velocidade = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_velocidade, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    velocidade = data[0].value;
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
                    tonalidade = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_larguraEtq = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_larguraEtq, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    largura_etiqueta = data[0].value;
                    resolve();
                }
            })
        })
    }

    const save_metodoImpressao = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_metodoImpressao, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    if (data[0].value == 1) {
                        metodo_impressao = "Transf. térmica"
                    } else {
                        metodo_impressao = "Térmico direto"
                    }
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
                    if (data[0].value == "noSuchObject" || data[0].value == "" || data[0].value.length <= 5) {
                        rede_conectada = "Cabeada"
                    } else {
                        rede_conectada = data[0].value;
                    }
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
                    tipo_sensor = data[0].value
                    resolve();
                }
            })
        })
    }

    const save_statusCabeca = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_statusCabeca, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    if (data[0].value == 1) {
                        status_cabeca = "Fechado"
                    } else {
                        status_cabeca = "Aberto"
                    }
                    resolve();
                }
            })
        })
    }

    const save_statusPause = () => {
        return new Promise((resolve, reject) => {
            session.get({ oid: oid_statusPause, }, function (error, data) {
                if (error) {
                    reject();
                } else {
                    if (data[0].value == 1) {
                        status_pause = "Sim"
                    } else {
                        status_pause = "Não"
                    }
                    resolve();
                }
            })
        })
    }

    await save_serial();
    await save_modelo();
    await save_fabricante();
    await save_contador();
    await save_velocidade();
    await save_tonEscuro();
    await save_larguraEtq();
    await save_metodoImpressao();
    await save_tipoSensor();
    await save_redeConectada();
    await save_statusCabeca();
    await save_statusPause();

    let zebraInfo = {
        enderecoFila,
        nomeFila,
        rede,
        serial,
        modelo,
        fabricante,
        contador,
        velocidade,
        tonalidade,
        largura_etiqueta,
        metodo_impressao,
        tipo_sensor,
        rede_conectada,
        status_cabeca,
        status_pause
    };

    session.close();
    return zebraInfo;

}