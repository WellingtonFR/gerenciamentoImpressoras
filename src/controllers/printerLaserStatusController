const sequelize = require("sequelize")
const dadosbase = require("../database/db")
const PrinterLaserStatus = require("../database/models/PrinterLaserStatusModel")

const find = async () => {
    let dados = await PrinterLaserStatus.findAll({
        order: ["nomeFila"],
        where: {
            nomeFila: {
                [sequelize.Op.notLike]: "%ETQ%",
                [sequelize.Op.notLike]: "%etq%"
            }
        }
    }).catch(error => {
        console.log("Erro ao buscar as informacoes " + error)
    })

    return dados;
}

const findByName = async (nomeFila) => {
    let dados = await PrinterLaserStatus.findOne({
        where: { nomeFila: nomeFila }
    }).catch(error => {
        console.log("Erro ao buscar as informacoes " + error)
    })

    return dados;
}

const create = (dados) => {

    PrinterLaserStatus.create({
        nomeFila: dados.nomeFila,
        enderecoFila: dados.enderecoFila,
        rede: dados.rede,
        modelo: dados.modelo,
        fabricante: dados.fabricante,
        toner: dados.toner,
        unidadeImagem: dados.unidadeImagem,
        kitManutencao: dados.kitManutencao,
        contador: dados.contador,
        serial: dados.serial,
    }).catch(error => {
        console.log("Erro ao salvar as informacoes da impressora: " + dados.nomeFila + " " + error)
    })
}

const update = (dados) => {

    PrinterLaserStatus.update({
        nomeFila: dados.nomeFila,
        enderecoFila: dados.enderecoFila,
        rede: dados.rede,
        modelo: dados.modelo,
        fabricante: dados.fabricante,
        toner: dados.toner,
        unidadeImagem: dados.unidadeImagem,
        kitManutencao: dados.kitManutencao,
        contador: dados.contador,
        serial: dados.serial
    }, { where: { nomeFila: dados.nomeFila } })
        .catch(error => {
            console.log("Erro ao atualizar as informacoes da impressora: " + dados.nomeFila + " " + error)
        })
}

const exclude = (nomeFila) => {

    PrinterLaserStatus.destroy({
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