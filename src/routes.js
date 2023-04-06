const express = require("express");
const router = express.Router();

const PrinterLaserStatusController = require("./controllers/PrinterLaserStatusController");
const PrinterTermicaStatusController = require("./controllers/PrinterTermicaStatusController");
const printerController = require("./controllers/printerController");
const database = require("./database/db");
const { dialog, BrowserWindow } = require("electron");
const inserirDadosCSV = require("./snmp/inserirDadosCSV");
const getPrinterLaserInformation = require("./controllers/getPrinterLaserInformation");
const getPrinterTermicaInformation = require("./controllers/getPrinterTermicaInformation");

router.get('/laser', async (req, res) => {

    let tabela = []

    await PrinterLaserStatusController.find().then(dados => {
        dados.forEach(printer => {
            printer.dataValues.updatedAt = printer.dataValues.updatedAt.toLocaleString().replace(",", "");
            tabela.push(printer.dataValues);
        });
    })

    res.render("laser", { tabela: tabela })
});

router.get('/laser/refresh', (req, res) => {

    getPrinterLaserInformation();
    getPrinterTermicaInformation();

    setTimeout(() => {
        res.redirect("/laser")
    }, 10000);
})

router.get('/termica', async (req, res) => {

    let tabela = []

    await PrinterTermicaStatusController.find().then(dados => {
        dados.forEach(printer => {
            tabela.push(printer.dataValues);
        });
    })

    res.render("termica", { tabela: tabela })
});

router.get('/termica/refresh', (req, res) => {

    getPrinterLaserInformation();
    getPrinterTermicaInformation();

    setTimeout(() => {
        res.redirect("/termica")
    }, 10000);
})

router.get('/refresh/details', (req, res) => {

    getPrinterLaserInformation();
    getPrinterTermicaInformation();

    setTimeout(() => {
        res.redirect("/details")
    }, 10000);
})

router.get('/details', async (req, res) => {

    let tabela = []

    await PrinterLaserStatusController.find().then(dados => {
        dados.forEach(printer => {
            tabela.push(printer.dataValues);
        });
    })

    await PrinterTermicaStatusController.find().then(dados => {
        dados.forEach(printer => {
            tabela.push(printer.dataValues);
        });
    })

    res.render("details", { tabela: tabela })
});

router.post('/details/:nomeFila', async (req, res) => {

    let nomeFila = req.params.nomeFila

    await PrinterLaserStatusController.findByName(nomeFila).then(dados => {
        let data = {
            nomeFila: dados.nomeFila,
            enderecoFila: dados.enderecoFila,
            rede: dados.rede,
            modelo: dados.modelo,
            serial: dados.serial,
            fabricante: dados.fabricante,
            toner: dados.toner,
            unidadeImagem: dados.unidadeImagem,
            kitManutencao: dados.kitManutencao,
            contador: dados.contador,
        }

        res.render("modalDetails", { dados: data })
    })

});

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
    }, 5000);
});

router.post("/settings/:nomeFila", async (req, res) => {

    await printerController.exclude(req.params.nomeFila);
    await PrinterLaserStatusController.exclude(req.params.nomeFila);
    await PrinterTermicaStatusController.exclude(req.params.nomeFila);

    res.redirect("/settings")
});

router.post("/settings/add/printer", async (req, res) => {

    let nomeFila = req.body.nomeFila
    let enderecoFila = req.body.enderecoFila

    await printerController.create({ nomeFila: nomeFila, enderecoFila: enderecoFila });
    res.redirect("/settings");
})

module.exports = router;