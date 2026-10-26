const express = require("express");
const app = express();
const session = require("express-session");
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    req.TPL = {};
    req.TPL.displaylogin = !req.session.username;
    req.TPL.displaylogout = req.session.username;
    next();
})

app.use("/catalog", function(req, res, next) {
    req.TPL.catalognav = true;
    next();
});

app.use("/login", function(req, res, next) {
    req.TPL.loginnav = true;
    next();
});

app.use("/manager", function(req, res, next) {
    req.TPL.managernav = true;
    next();
});

app.use("/manager", function(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect("/login");
    }
});

app.get("/", function(req, res) {
    res.redirect("/catalog");
})

app.get(/^(.+)$/, function(req, res) {
    res.sendFile(__dirname + req.params[0]);
});

app.listen(3000, function() {
    console.log("Testing server on http://localhost:3000")
});