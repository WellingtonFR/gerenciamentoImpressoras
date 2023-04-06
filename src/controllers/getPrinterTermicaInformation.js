const axios = require("axios")
const database = require("../database/db")
const getZebraInfo = require("../snmp/zebra")
const getHoneywellInfo = require("../snmp/honeywell")
const PrinterTermicaStatusController = require("./printerTermicaStatusController")
const printerController = require("./printerController")

const getPrinterTermicaInformation = (async () => {

    await printerController.find().then(data => {

        data.forEach(printerData => {

            let url = "http://" + printerData.enderecoFila
            let urlZebra = "http://" + printerData.enderecoFila + "/setadv";
            let urlHoneywell = "http://" + printerData.enderecoFila + "/index.lua";


            //Zebra
            axios.get(urlZebra).then(response => {

                if (response.status == 200) {

                    getZebraInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosZebra => {
                        PrinterTermicaStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                PrinterTermicaStatusController.create(dadosZebra);
                            } else {
                                PrinterTermicaStatusController.update(dadosZebra);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            //Honeywell
            axios.get(urlHoneywell).then(response => {

                if (response.status == 200) {

                    console.log("Link ok")

                    getHoneywellInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosHoneywell => {
                        PrinterTermicaStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                console.log("Dados honeywell ok create")
                                PrinterTermicaStatusController.create(dadosHoneywell);
                            } else {
                                console.log("Dados honeywell ok update")
                                PrinterTermicaStatusController.update(dadosHoneywell);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            //Erros: não conexão
            axios.get(url, { timeout: 7000 }).then(response => {

                if (response.status != 200) {

                    PrinterTermicaStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                        if (dadosRetorno == null) {
                            PrinterTermicaStatusController.create({
                                enderecoFila: printerData.enderecoFila,
                                nomeFila: printerData.nomeFila,
                                rede: "Offline",
                                serial: "-",
                                modelo: "-",
                                fabricante: "-",
                                contador: "-",
                                velocidade: "-",
                                tonalidade: "-",
                                largura_etiqueta: "-",
                                metodo_impressao: "-",
                                tipo_sensor: "-",
                                rede_conectada: "-",
                                status_cabeca: "-",
                                status_pause: "-",
                            });
                        } else {
                            PrinterTermicaStatusController.update({
                                enderecoFila: printerData.enderecoFila,
                                nomeFila: printerData.nomeFila,
                                rede: "Offline",
                                serial: "-",
                                modelo: "-",
                                fabricante: "-",
                                contador: "-",
                                velocidade: "-",
                                tonalidade: "-",
                                largura_etiqueta: "-",
                                metodo_impressao: "-",
                                tipo_sensor: "-",
                                rede_conectada: "-",
                                status_cabeca: "-",
                                status_pause: "-",
                            });
                        }
                    }).catch(error => {
                        console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                    })
                }

            }).catch(() => {

                PrinterTermicaStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                    if (dadosRetorno == null) {
                        PrinterTermicaStatusController.create({
                            enderecoFila: printerData.enderecoFila,
                            nomeFila: printerData.nomeFila,
                            rede: "Offline",
                            serial: "-",
                            modelo: "-",
                            fabricante: "-",
                            contador: "-",
                            velocidade: "-",
                            tonalidade: "-",
                            largura_etiqueta: "-",
                            metodo_impressao: "-",
                            tipo_sensor: "-",
                            rede_conectada: "-",
                            status_cabeca: "-",
                            status_pause: "-",
                        });
                    } else {
                        PrinterTermicaStatusController.update({
                            enderecoFila: printerData.enderecoFila,
                            nomeFila: printerData.nomeFila,
                            rede: "Offline",
                            serial: "-",
                            modelo: "-",
                            fabricante: "-",
                            contador: "-",
                            velocidade: "-",
                            tonalidade: "-",
                            largura_etiqueta: "-",
                            metodo_impressao: "-",
                            tipo_sensor: "-",
                            rede_conectada: "-",
                            status_cabeca: "-",
                            status_pause: "-",
                        });
                    }
                }).catch(error => {
                    console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                })
            })

        })

    }).catch(error => {
        console.log("Erro ao buscar informacoes na base impressoras: " + error);
    })

})

module.exports = getPrinterTermicaInformation