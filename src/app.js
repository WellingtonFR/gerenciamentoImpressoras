const express = require('express');
const hbs = require("express-handlebars");
const port = 3002;
const routes = require("./routes");

const db = require("./database/db")
const inserirDadosCSV = require('./functions/inserirDadosCSV');
const getPrinterInformation = require('./controllers/getPrinterInformation');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//configuration
app.use(express.static("./public"));

//sequelize
(async () => {
    await db.sync();
})();


console.log("hello antes")
inserirDadosCSV()
console.log("hello depois")
//getPrinterInformation

//handlebars
var hbshelper = hbs.create({
    helpers: {
        if: function (v1, v2, options) {
            if (v1 <= v2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        ifString: function (v1, v2, options) {
            if (v1 == v2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
    },
});

app.engine("handlebars", hbshelper.engine);
app.set("view engine", "handlebars");
app.set('views', './src/views');

//route
app.use("/", routes)

//server
app.listen(port, () => console.log());

module.exports = app;