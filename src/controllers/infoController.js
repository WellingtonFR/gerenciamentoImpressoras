const express = require("express")
const fs = require("fs")
const csv = require("csv-parser");

let dados = [];

fs.createReadStream("Impressoras.csv")
    .pipe(csv())
    .on("data", (data) => dados.push(data));