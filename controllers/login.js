const express = require("express");
const router = express.Router();
const UsersModel = require("../models/users.js");
const { User } = require("discord.js");

router.get("/", function(req, res) {
    if (req.session.username) {
        return res.redirect("/manager");
    }
    req.TPL.login_error = req.session.login_error;
    req.session.login_error = "";
    res.render("login", req.TPL);
});

router.post("/attemptlogin", async function (req, res) {
    const user = await UsersModel.checkUser(req.body.username, req.body.password);
    if (user) {
        req.session.username = user.username;
        res.redirect("/manager");
    } else {
        req.session.login_error = "Invalid username and/or password"
        res.redirect("/login");
    }
});

router.get("/logout", function(req, res) {
    delete req.session.username;
    res.redirect("/catalog");
});

module.exports = router;