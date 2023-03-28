const axios = require("axios")
const database = require("../database/db")
const Printers = require("../database/models/printerModel")
const getHPInfo = require("../functions/hpInfo")
const getSamsungInfo = require("../functions/samsung6555Info")
const printerStatusController = require("./printerStatusController")
const printerController = require("./printerController")

const getPrinterInformation = (async () => {

    await printerController.find().then(data => {

        data.forEach(printerData => {

            let url = "http://" + printerData.enderecoFila
            let urlHP = "https://" + printerData.enderecoFila + "/hp/device/DeviceStatus/Index";
            let urlSamsung = "http://" + printerData.enderecoFila + "/sws/app/information/home/home.json";
            let urlSamsung6555 = "http://" + printerData.enderecoFila + "/Information/supplies_status.htm";
            let urlSamsungM5360RX = "http://" + printerData.enderecoFila + "/sws.application/home/homeDeviceInfo.sws";

            //HPs
            axios.get(urlHP).then(response => {

                if (response.status == 200) {

                    getHPInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosHP => {
                        printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                printerStatusController.create(dadosHP);
                            } else {
                                printerStatusController.update(dadosHP);
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
                        printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                printerStatusController.create(dadosSamsung);
                            } else {
                                printerStatusController.update(dadosSamsung);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            //Samsung 6555
            axios.get(urlSamsung6555).then(response => {

                if (response.status == 200) {

                    getSamsungInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosSamsung6555 => {
                        printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                printerStatusController.create(dadosSamsung6555);
                            } else {
                                printerStatusController.update(dadosSamsung6555);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            axios.get(urlSamsungM5360RX).then(response => {

                if (response.status == 200) {

                    getSamsungInfo(printerData.enderecoFila, printerData.nomeFila).then(dadosSamsungM5360RX => {
                        printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                            if (dadosRetorno == null) {
                                printerStatusController.create(dadosSamsungM5360RX);
                            } else {
                                printerStatusController.update(dadosSamsungM5360RX);
                            }
                        }).catch(error => {
                            console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                        })

                    })
                }

            }).catch(error => { })

            axios.get(url, { timeout: 7000 }).then(response => {

                if (response.status != 200) {

                    printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                        if (dadosRetorno == null) {
                            printerStatusController.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                toner: "-",
                                unidadeImagem: "-",
                                kitManutencao: "-",
                                contador: "-",
                                modelo: "-",
                                serial: "-",
                                fabricante: "-",
                                rede: "Offline"
                            });
                        } else {
                            printerStatusController.update({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                toner: "-",
                                unidadeImagem: "-",
                                kitManutencao: "-",
                                contador: "-",
                                modelo: "-",
                                serial: "-",
                                fabricante: "-",
                                rede: "Offline"
                            });
                        }
                    }).catch(error => {
                        console.log("Erro ao buscar informacoes na base status impressoras: " + error);
                    })
                }

            }).catch(() => {

                printerStatusController.findByName(printerData.nomeFila).then(dadosRetorno => {
                    if (dadosRetorno == null) {
                        printerStatusController.create({
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
                        printerStatusController.update({
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

module.exports = getPrinterInformation