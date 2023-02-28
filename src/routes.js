const express = require("express");
const router = express.Router();

const database = require("./database/db")
const PrinterStatus = require("./database/models/printerStatusModel")

let dados = [];

function refreshPrinterData() {


    PrinterStatus.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] }, order: ["nomeFila"]
    })
        .then(data => {

            data.forEach(printerData => {
                dados.push({
                    nomeFila: printerData.nomeFila,
                    enderecoFila: printerData.enderecoFila,
                    rede: printerData.rede,
                    modelo: printerData.modelo,
                    serial: printerData.serial,
                    fabricante: printerData.fabricante,
                    toner: printerData.toner,
                    unidadeImagem: printerData.unidadeImagem,
                    kitManutencao: printerData.kitManutencao,
                    contador: printerData.contador
                })
            })
        })
}

refreshPrinterData();


router.get('/', (req, res) => res.render("home", { tabela: dados }));
router.get('/gerenciamento', (req, res) => res.render("gerenciamento"));
router.get('/cardsView', (req, res) => res.render("cards"));

module.exports = router;