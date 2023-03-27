const express = require("express");
const router = express.Router();

const printerStatusController = require("./controllers/printerStatusController");
const printerController = require("./controllers/printerController");
const database = require("./database/db");
const { dialog, BrowserWindow } = require("electron");
const inserirDadosCSV = require("./functions/inserirDadosCSV");
const window = require("./index");
const getPrinterInformation = require("./controllers/getPrinterInformation");

router.get('/', async (req, res) => {

    let tabela = []

    await printerStatusController.find().then(dados => {
        dados.forEach(printer => {
            printer.dataValues.updatedAt = printer.dataValues.updatedAt.toLocaleString().replace(",", "");
            tabela.push(printer.dataValues);
        });
    })

    res.render("home", { tabela: tabela })
});

router.get('/refresh', (req, res) => {

    getPrinterInformation();

    setTimeout(() => {
        res.redirect("/")
    }, 6000);
})

router.get('/cards', (req, res) => res.render("cards"));

router.get('/settings', async (req, res) => {

    let tabela = []

    await printerController.find().then(dados => {
        dados.forEach(printer => {
            tabela.push(printer.dataValues);
        });
    })

    res.render("settings", { tabela: tabela });
});

router.get('/settings/add/csv', (req, res) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'CSV', extensions: ['csv'] }]
    }).then(result => {
        if (result.canceled) {
            console.log("Cancelado" + result.canceled);
        } else {
            inserirDadosCSV(result.filePaths);
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                defaultId: 1,
                type: "info",
                title: "Importação de CSV",
                message: "Importado com sucesso",
                buttons: ["OK"]
            });
        }
    }).catch(error => {
        console.log("Erro ao buscar CSV: " + error)
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            defaultId: 2,
            type: "error",
            title: "Importação de CSV",
            message: "Erro ao importar: " + error,
            buttons: ["OK"]
        });
    })

    setTimeout(() => {
        res.redirect("/settings");
    }, 3000);
});

router.post("/settings/:nomeFila", async (req, res) => {

    await printerController.exclude(req.params.nomeFila);
    await printerStatusController.exclude(req.params.nomeFila);

    res.redirect("/settings")
});

router.post("/settings/add/printer", async (req, res) => {

    let nomeFila = req.body.nomeFila
    let enderecoFila = req.body.enderecoFila

    await printerController.create({ nomeFila: nomeFila, enderecoFila: enderecoFila });
    res.redirect("/settings");
})

module.exports = router;