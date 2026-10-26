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

app.use("/catalog", require("./controllers/catalog"));

app.get("/", function(req, res) {
    res.redirect("/catalog");
})

app.get(/^(.+)$/, function(req, res) {
    res.sendFile(__dirname + req.params[0]);
});

app.listen(3000, function() {
    console.log("Testing server on http://localhost:3000")
});