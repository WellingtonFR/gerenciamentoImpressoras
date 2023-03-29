const fs = require("fs")
const csv = require("csv-parser");
const database = require("../database/db")
const Printers = require("../database/models/printerModel");
const { findByName } = require("../controllers/printerController");

const inserirDadosCSV = (caminho) => {

    fs.createReadStream(caminho[0])
        .pipe(csv())
        .on("data", async (data) => {

            await findByName(data.Fila).then(dados => {

                if (dados == null) {
                    Printers.create({
                        nomeFila: data.Fila,
                        enderecoFila: data.IP
                    })
                }
            })
                .catch(error => {
                    console.log("Erro ao incluir dados do CSV" + error);
                })
        });
}

module.exports = inserirDadosCSV