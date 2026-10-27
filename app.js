require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const session = require("express-session");
const mustacheExpress = require("mustache-express");
const { Client, Collection, GateWayIntentBits } = require('discord.js');

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

app.use("/catalog", require("./controllers/catalog"));
app.use("/login", require("./controllers/login"));
app.use("/manager", require("./controllers/manager"));

app.get("/", function(req, res) {
    res.redirect("/catalog");
})

app.get(/^(.+)$/, function(req, res) {
    res.sendFile(__dirname + req.params[0]);
});

const Client = new Client({ intents: [GateWayIntentBits.Guilds] });
client.commands = new Collection();

const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', function() {
    console.log(`Discord Bot logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async function(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, io);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);

http.listen(3000, function() {
    console.log("Server and WebSockets listending on http://localhost:300");
});