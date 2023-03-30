const sequelize = require("sequelize")
const dadosbase = require("../database/db")
const PrinterTermicaStatus = require("../database/models/printerTermicaStatusModel")

const find = async () => {
    let dados = await PrinterTermicaStatus.findAll({
        order: ["nomeFila"],
        where: {
            nomeFila: {
                [sequelize.Op.like]: "%ETQ%",
                [sequelize.Op.like]: "%etq%",
            }
        }
    }).catch(error => {
        console.log("Erro ao buscar as informacoes " + error)
    })

    return dados;
}

const findByName = async (nomeFila) => {
    let dados = await PrinterTermicaStatus.findOne({
        where: { nomeFila: nomeFila }
    }).catch(error => {
        console.log("Erro ao buscar as informacoes " + error)
    })

    return dados;
}

const create = (dados) => {

    PrinterTermicaStatus.create({
        enderecoFila: dados.enderecoFila,
        nomeFila: dados.nomeFila,
        rede: dados.rede,
        serial: dados.serial,
        modelo: dados.modelo,
        fabricante: dados.fabricante,
        contador: dados.contador,
        velocidade: dados.velocidade,
        tonalidade: dados.tonalidade,
        largura_etiqueta: dados.largura_etiqueta,
        metodo_impressao: dados.metodo_impressao,
        tipo_sensor: dados.tipo_sensor,
        rede_conectada: dados.rede_conectada,
        status_cabeca: dados.status_cabeca,
        status_pause: dados.status_pause
    }).catch(error => {
        console.log("Erro ao salvar as informacoes da impressora: " + dados.nomeFila + " " + error)
    })
}

const update = (dados) => {

    PrinterTermicaStatus.update({
        enderecoFila: dados.enderecoFila,
        nomeFila: dados.nomeFila,
        rede: dados.rede,
        serial: dados.serial,
        modelo: dados.modelo,
        fabricante: dados.fabricante,
        contador: dados.contador,
        velocidade: dados.velocidade,
        tonalidade: dados.tonalidade,
        largura_etiqueta: dados.largura_etiqueta,
        metodo_impressao: dados.metodo_impressao,
        tipo_sensor: dados.tipo_sensor,
        rede_conectada: dados.rede_conectada,
        status_cabeca: dados.status_cabeca,
        status_pause: dados.status_pause
    }, { where: { nomeFila: dados.nomeFila } })
        .catch(error => {
            console.log("Erro ao atualizar as informacoes da impressora: " + dados.nomeFila + " " + error)
        })
}

const exclude = (nomeFila) => {

    PrinterTermicaStatus.destroy({
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