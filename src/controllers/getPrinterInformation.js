const axios = require("axios")
const cheerio = require("cheerio")
const database = require("../database/db")
const Printers = require("../database/models/printerModel")
const PrinterStatus = require("../database/models/printerStatusModel")

function limpar(valor) {
    valor = valor.trim();
    valor = valor.replace(",", "");
    valor = valor.replace(";", "");
    valor = valor.replace("'", "");
    valor = valor.replace('"', "");
    valor = valor.replace("<", "");
    valor = valor.replace(">", "");
    valor = valor.replace("%", "");
    valor = valor.replace("*", "");
    return valor;
}

function filtrar(indice1, indice2, dados) {
    let filtro = dados.substring(dados.search(indice1), dados.search(indice2));
    let indice = filtro.search("remaining");
    let valor = filtro.substring(indice + 10, indice + 14);
    valor = limpar(valor);
    return valor;
}

function filtrarModelo(indice1, indice2, dados) {
    let filtro = dados.substring(dados.search(indice1), dados.search(indice2));
    let indice3 = filtro.search('"');
    let indice4 = filtro.search(",");
    let valor = filtro.substring(indice3 + 1, indice4 - 1);
    valor = limpar(valor);
    return valor;
}

function filtrar6555(indice1, indice2, dados) {
    let filtro = dados.substring(dados.search(indice1), dados.search(indice2));
    let indice = filtro.search("=");
    let valor = filtro.substring(indice + 2, indice + 5);

    valor = limpar(valor);
    return valor;
}

function filtrarM5360RX(indice1, indice2, dados) {
    let filtro = dados.substring(dados.search(indice1), dados.search(indice2));
    let indice = filtro.search("remaining");
    let valor = filtro.substring(indice + 10, indice + 15);

    valor = limpar(valor);

    let i = valor.search("'");
    if (i == 2) {
        valor = valor.substring(0, valor.length - 1);
    }

    return valor;
}

const getPrinterInformation = (() => {

    Printers.findAll({ attributes: ["nomeFila", "enderecoFila"] }).then(data => {

        data.forEach(async printerData => {

            //string de conexão
            let urlHP = "https://" + printerData.enderecoFila + "/hp/device/DeviceStatus/Index";
            let urlSamsung = "http://" + printerData.enderecoFila + "/sws/app/information/home/home.json";
            let urlSamsung6555 = "http://" + printerData.enderecoFila + "/Information/supplies_status.htm";
            let urlSamsungM5360RX = "http://" + printerData.enderecoFila + "/sws.application/home/homeDeviceInfo.sws";

            //Todas as HPs
            await axios.get(urlHP).then(async response => {

                if (response.status == "200") {

                    let $ = cheerio.load(response.data);
                    let toner = $("#SupplyPLR0").text();
                    let kitManutencao = $("#SupplyPLR1").text();
                    let modelo = $("#HomeDeviceName").text();

                    toner ? toner = limpar(toner) : toner = "-";
                    kitManutencao ? kitManutencao = limpar(kitManutencao) : kitManutencao = "-";

                    if (modelo) {

                        let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

                        if (!findPrinter) {
                            await PrinterStatus.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "HP",
                                toner: toner,
                                unidadeImagem: "-",
                                kitManutencao: kitManutencao,
                                contador: "-"
                            }).catch(error => { })
                        } else {
                            await PrinterStatus.update({
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "HP",
                                toner: toner,
                                kitManutencao: kitManutencao,
                                contador: "-"
                            }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
                        }
                    }
                }
            }).catch(error => { })

            //Maioria da Samsung
            await axios.get(urlSamsung).then(async response => {

                if (response.status == "200") {

                    let unidadeImagem = filtrar("drum_black", "drum_cyan", response.data);
                    let toner = filtrar("toner_black", "toner_cyan", response.data);
                    let modelo = filtrarModelo("model_name", "host_name", response.data);

                    if (modelo == "SL-M4020ND" || modelo == "Samsung CLX-6260 Series") { unidadeImagem = "-"; }

                    if (modelo) {

                        let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

                        if (!findPrinter) {
                            await PrinterStatus.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                kitManutencao: "-",
                                contador: "-"
                            }).catch(error => { })
                        } else {
                            await PrinterStatus.update({
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                kitManutencao: "-",
                                contador: "-"
                            }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
                        }
                    }
                }
            }).catch(error => { })

            //Samsung 6555 (Multifuncional)
            await axios.get(urlSamsung6555).then(async response => {

                if (response.status == "200") {

                    let toner = filtrar6555("BlackTonerPer", "drumInstalled", response.data);
                    let unidadeImagem = filtrar6555("BlackDrumPer", "ImageTranserBeltPer", response.data);
                    let modelo = "SCX-6x55X Series";

                    if (toner || unidadeImagem) {

                        let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

                        if (!findPrinter) {
                            await PrinterStatus.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                kitManutencao: "-",
                                contador: "-"
                            }).catch(error => { })
                        } else {
                            await PrinterStatus.update({
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                kitManutencao: "-",
                                contador: "-"
                            }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
                        }
                    }
                }
            }).catch(error => { })

            await axios.get(urlSamsungM5360RX).then(async response => {

                if (response.status == "200" && response.data != "") {

                    let toner = filtrarM5360RX("tonerData", "loadTonerData", response.data);
                    let unidadeImagem = filtrarM5360RX("imagineData", "loadImagineData", response.data);
                    let modelo = "Samsung M5360RX";

                    if (toner || unidadeImagem) {

                        let findPrinter = await PrinterStatus.findOne({ where: { nomeFila: printerData.nomeFila } }).catch(error => { })

                        if (!findPrinter) {
                            await PrinterStatus.create({
                                nomeFila: printerData.nomeFila,
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                contador: "-"
                            }).catch(error => { })
                        } else {
                            await PrinterStatus.update({
                                enderecoFila: printerData.enderecoFila,
                                rede: "Online",
                                modelo: modelo,
                                fabricante: "Samsung",
                                toner: toner,
                                unidadeImagem: unidadeImagem,
                                kitManutencao: "-",
                                contador: "-"
                            }, { where: { nomeFila: printerData.nomeFila } }).catch(error => { })
                        }
                    }
                }
            }).catch(error => { })
        })
    })
})

module.exports = getPrinterInformation();