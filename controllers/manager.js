const express = require("express");
const router = express.Router();
const GamesModel = require("../models/games.js");

router.get("/", async function (req, res) {
    req.TPL.username = req.session.username;
    req.TPL.games = await GamesModel.getAllGames();
    res.render("manager", req.TPL);
});

router.post("/create", async function (req, res) {
    await GamesModel.createGame(
        req.body.title,
        req.body.category,
        req.body.players,
        req.body.price,
        req.body.stock
    );
    res.redirect("/manger");
});

router.post("/update/:id", async function (req, res) {
    await GamesModel.updateGame(
        req.params.id,
        req.body.title,
        req.body.category,
        req.body.players,
        req.body.price,
        req.body.stock
    );
    res.redirect("/manager")
});

router.get("/delete/:id", async function (req, res) {
    await GamesModel.deleteGame(req.params.id);
    res.redirect("/manager");  
})

module.exports = router;