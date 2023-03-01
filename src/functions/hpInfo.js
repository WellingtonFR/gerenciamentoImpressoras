const snmp = require('snmp-native');

let enderecoFila = ""
let nomeFila = ""
let serial = ""
let modelo = ""
let fabricante = ""
let toner = ""
let kitManutencao = ""
let contador = ""

module.exports = function getHPInfo(ip, nome) {

    var session = new snmp.Session({ host: ip, port: 161, community: 'public' });

    enderecoFila = ip;
    nomeFila = nome;

    session.get({ oid: '.1.3.6.1.2.1.43.11.1.1.9.1.1', }, function (error, data) {
        toner = data[0].value;
    })

    session.get({ oid: '.1.3.6.1.2.1.43.11.1.1.9.1.2', }, function (error, data) {
        if (data[0].value == "noSuchInstance") {
            kitManutencao = "-";
        } else {
            kitManutencao = data[0].value;
        }
    });

    session.get({ oid: '.1.3.6.1.2.1.43.10.2.1.4.1.1', }, function (error, data) {
        contador = data[0].value;
    });

    session.get({ oid: '.1.3.6.1.2.1.43.5.1.1.16.1', }, function (error, data) {
        modelo = data[0].value;
    });

    session.get({ oid: '.1.3.6.1.2.1.43.5.1.1.17.1', }, function (error, data) {
        serial = data[0].value;
    });

    session.get({ oid: '.1.3.6.1.2.1.43.8.2.1.14.1.1', }, function (error, data) {
        fabricante = data[0].value;
    });

    let hpInfo = {
        enderecoFila,
        nomeFila,
        serial,
        modelo,
        fabricante,
        toner,
        kitManutencao,
        contador
    }

    return hpInfo
}