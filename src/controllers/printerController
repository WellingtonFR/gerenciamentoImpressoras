const dadosbase = require("../database/db")
const Printer = require("../database/models/printerModel")

const find = async () => {
    let dados = await Printer.findAll(
        {
            exclude: ["createdAt", "updatedAt"],
            order: ["nomeFila"]
        }).catch(error => {
            console.log("Erro ao buscar as informacoes " + error)
        })

    return dados;
}

const findByName = async (nomeFila) => {
    let dados = await Printer.findOne({
        where: { nomeFila: nomeFila }
    }).catch(error => {
        console.log("Erro ao buscar as informacoes " + error)
    })

    return dados;
}

const create = async (dados) => {

    if (dados.nomeFila != "" && dados.enderecoFila != "") {

        const existe = await Printer.findOne({ where: { nomeFila: dados.nomeFila } });

        if (!existe) {
            await Printer.create({
                nomeFila: dados.nomeFila,
                enderecoFila: dados.enderecoFila,
            }).catch(error => {
                console.log("Erro ao salvar as informacoes da impressora: " + dados.nomeFila + " " + error)
            })
        }
    }
}

const update = (dados) => {

    Printer.create({
        nomeFila: dados.nomeFila,
        enderecoFila: dados.enderecoFila,
    }).catch(error => {
        console.log("Erro ao atualizar as informacoes da impressora: " + dados.nomeFila + " " + error)
    })
}

const exclude = (nomeFila) => {

    Printer.destroy({
        where: {
            nomeFila: nomeFila
        }
    }).catch(error => {
        console.log("Erro ao excluir a impressora: " + dados.nomeFila + " " + error)
    })
}

module.exports = {
    find,
    findByName,
    create,
    update,
    exclude
}