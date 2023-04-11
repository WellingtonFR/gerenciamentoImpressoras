const axios = require("axios")
const database = require("../database/db")
const Printers = require("../database/models/printerModel")
const getHPInfo = require("../snmp/hp")
const getSamsungInfo = require("../snmp/samsung")
const PrinterLaserStatusController = require("./PrinterLaserStatusController")
const printerController = require("./printerController")

const getPrinterLaserInformation = (async () => {

    await printerController.find().then(data => {

        data.forEach(printerData => {

            let url = "http://" + printerData.enderecoFila
            let urlHP = "https://" + printerData.enderecoFila + "/hp/device/DeviceStatus/Index";
            let urlSamsung = "http://" + printerData.enderecoFila + "/sws/app/information/home/home.json";
            let urlSamsung6555 = url + "/Information/supplies_status.htm";
            let urlSamsungM5360RX = url + "/sws.application/home/homeDeviceInfo.sws";

            //HPs
            axios.get(urlHP).then(response => {

                if (response.status == 200) {

                    getHPInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosHP => {
                        PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                PrinterLaserStatusController.create(dadosHP);
                            } else {
                                PrinterLaserStatusController.update(dadosHP);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            //Maioria das Samsung
            axios.get(urlSamsung).then(response => {

                if (response.status == 200) {

                    getSamsungInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosSamsung => {
                        PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                PrinterLaserStatusController.create(dadosSamsung);
                            } else {
                                PrinterLaserStatusController.update(dadosSamsung);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            axios.get(urlSamsung6555).then(response => {

                if (response.status == 200) {

                    getSamsungInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosSamsung => {
                        PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                PrinterLaserStatusController.create(dadosSamsung);
                            } else {
                                PrinterLaserStatusController.update(dadosSamsung);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            axios.get(urlSamsungM5360RX).then(response => {

                if (response.status == 200) {

                    getSamsungInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosSamsung => {
                        PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                PrinterLaserStatusController.create(dadosSamsung);
                            } else {
                                PrinterLaserStatusController.update(dadosSamsung);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            axios.get(url, { timeout: 7000 }).then(response => {

                if (response.status != 200) {

                    PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                        if (dadosRetorno == null) {
                            PrinterLaserStatusController.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Offline",
                                toner: "-",
                                unidadeImagem: "-",
                                kitManutencao: "-",
                                contador: "-",
                                modelo: "-",
                                serial: "-",
                                fabricante: "-"
                            });
                        } else {
                            PrinterLaserStatusController.update({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Offline",
                                toner: "-",
                                unidadeImagem: "-",
                                kitManutencao: "-",
                                contador: "-",
                                modelo: "-",
                                serial: "-",
                                fabricante: "-"
                            });
                        }
                    }).catch(error => {
                        console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                    })
                }

            }).catch(() => {

                PrinterLaserStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                    if (dadosRetorno == null) {
                        PrinterLaserStatusController.create({
                            nomeFila: printerData.nomeFila,
                            enderecoFila: printerData.enderecoFila,
                            rede: "Offline",
                            toner: "-",
                            unidadeImagem: "-",
                            kitManutencao: "-",
                            contador: "-",
                            modelo: "-",
                            serial: "-",
                            fabricante: "-",
                        });
                    } else {
                        PrinterLaserStatusController.update({
                            nomeFila: printerData.nomeFila,
                            enderecoFila: printerData.enderecoFila,
                            rede: "Offline",
                            toner: "-",
                            unidadeImagem: "-",
                            kitManutencao: "-",
                            contador: "-",
                            modelo: "-",
                            serial: "-",
                            fabricante: "-",
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

module.exports = getPrinterLaserInformation