const axios = require("axios")
const database = require("../database/db")
const Printers = require("../database/models/printerModel")
const getHPInfo = require("../functions/hpInfo")
const printerStatusController = require("./printerStatusController")

const getPrinterInformation = (() => {

    Printers.findAll({ attributes: ["nomeFila", "enderecoFila"] }).then(data => {

        data.forEach(printerData => {

            let urlHP = "https://" + printerData.enderecoFila + "/hp/device/DeviceStatus/Index";
            let urlSamsung = "http://" + printerData.enderecoFila + "/sws/app/information/home/home.json";
            let urlSamsung6555 = "http://" + printerData.enderecoFila + "/Information/supplies_status.htm";
            let urlSamsungM5360RX = "http://" + printerData.enderecoFila + "/sws.application/home/homeDeviceInfo.sws";

            //HPs
            axios.get(urlHP).then(response => {

                let hp = getHPInfo(printerData.enderecoFila, printerData.nomeFila)
                console.log("Dados" + hp.contador)

                if (response.status == "200") {
                    let existe = printerStatusController.buscaFilaExistente(printerData.enderecoFila)
                    if (existe) {
                        printerStatusController.create(dados)
                    } else {
                        printerStatusController.update(dados)
                    }
                }

            }).catch(error => { "Axios:" + error })

            //         //Maioria da Samsung
            //         await axios.get(urlSamsung).then(async response => {

            //             if (response.status == "200") {

            //                 let unidadeImagem = filtrar("drum_black", "drum_cyan", response.data);
            //                 let toner = filtrar("toner_black", "toner_cyan", response.data);
            //                 let modelo = filtrarModelo("model_name", "host_name", response.data);

            //                 if (modelo == "SL-M4020ND" || modelo == "Samsung CLX-6260 Series") { unidadeImagem = "-"; }

            //                 if (modelo) {

            //                     let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

            //                     if (!findPrinter) {
            //                         await PrinterStatus.create({
            //                             nomeFila: printerData.nomeFila,
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             kitManutencao: "-",
            //                             contador: "-"
            //                         }).catch(error => { })
            //                     } else {
            //                         await PrinterStatus.update({
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             kitManutencao: "-",
            //                             contador: "-"
            //                         }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
            //                     }
            //                 }
            //             }
            //         }).catch(error => { })

            //         //Samsung 6555 (Multifuncional)
            //         await axios.get(urlSamsung6555).then(async response => {

            //             if (response.status == "200") {

            //                 let toner = filtrar6555("BlackTonerPer", "drumInstalled", response.data);
            //                 let unidadeImagem = filtrar6555("BlackDrumPer", "ImageTranserBeltPer", response.data);
            //                 let modelo = "SCX-6x55X Series";

            //                 if (toner || unidadeImagem) {

            //                     let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

            //                     if (!findPrinter) {
            //                         await PrinterStatus.create({
            //                             nomeFila: printerData.nomeFila,
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             kitManutencao: "-",
            //                             contador: "-"
            //                         }).catch(error => { })
            //                     } else {
            //                         await PrinterStatus.update({
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             kitManutencao: "-",
            //                             contador: "-"
            //                         }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
            //                     }
            //                 }
            //             }
            //         }).catch(error => { })

            //         await axios.get(urlSamsungM5360RX).then(async response => {

            //             if (response.status == "200" && response.data != "") {

            //                 let toner = filtrarM5360RX("tonerData", "loadTonerData", response.data);
            //                 let unidadeImagem = filtrarM5360RX("imagineData", "loadImagineData", response.data);
            //                 let modelo = "Samsung M5360RX";

            //                 if (toner || unidadeImagem) {

            //                     let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

            //                     if (!findPrinter) {
            //                         await PrinterStatus.create({
            //                             nomeFila: printerData.nomeFila,
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             contador: "-"
            //                         }).catch(error => { })
            //                     } else {
            //                         await PrinterStatus.update({
            //                             enderecoFila: printerData.enderecoFila,
            //                             rede: "Online",
            //                             modelo: modelo,
            //                             fabricante: "Samsung",
            //                             toner: toner,
            //                             unidadeImagem: unidadeImagem,
            //                             kitManutencao: "-",
            //                             contador: "-"
            //                         }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
            //                     }
            //                 }
            //             }
            //         }).catch(error => { })
        })
    })
})

module.exports = getPrinterInformation();