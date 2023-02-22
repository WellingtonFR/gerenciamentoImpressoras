const express = require('express');
const hbs = require("express-handlebars");
const db = require("./database/db")
const populatePrinterData = require('./controllers/populateData');

const app = express();
const port = 3002;

const routes = require("./routes");

//configuration
app.use(express.static("./public"));

//sequelize
(async () => {
    await db.sync();
})();

populatePrinterData.populateData();

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
app.listen(port, () => console.log(`App listening to port ${port}`));

module.exports = app;