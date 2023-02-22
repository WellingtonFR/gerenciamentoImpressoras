const express = require("express");
const router = express.Router();

router.get('/', (req, res) => res.render("home"));
router.get('/gerenciamento', (req, res) => res.render("gerenciamento"));
router.get('/cardsView', (req, res) => res.render("cards"));
router.get('/listView', (req, res) => res.render("view"));

module.exports = router;