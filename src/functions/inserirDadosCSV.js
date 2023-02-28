const fs = require("fs")
const csv = require("csv-parser");
const database = require("../database/db")
const Printers = require("../database/models/printerModel")

const inserirDadosCSV = () => {

    console.log("hello dentro")

    fs.createReadStream("./public/Impressoras.csv")
        .pipe(csv())
        .on("data", async (data) => {

            const findPrinter = await Printers.findOne({ where: { nomeFila: data.Fila } })

            if (!findPrinter) {
                Printers.create({
                    nomeFila: data.Fila,
                    enderecoFila: data.IP
                })
            }
        });
}

module.exports = inserirDadosCSV