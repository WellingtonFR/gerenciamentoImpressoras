const express = require("express");
const router = express.Router();

const printerStatusController = require("./controllers/printerStatusController");
const database = require("./database/db")

router.get('/', async (req, res) => {

    let tabela = []

    await printerStatusController.find().then(dados => {
        dados.forEach(printer => {
            tabela.push(printer.dataValues)
        });
    })

    res.render("home", { tabela: tabela })
});

router.get('/gerenciamento', (req, res) => res.render("gerenciamento"));
router.get('/cardsView', (req, res) => res.render("cards"));

module.exports = router;