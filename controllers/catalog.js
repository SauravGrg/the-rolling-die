const express = require("express");
const router = express.Router();
const GamesModel = require("../models/games.js");

router.get("/", async function (req, res) {
    res.TPL.games = await GamesModel.getAllGames();
    res.render("catalog", req.TPL);
});

module.exports = router;