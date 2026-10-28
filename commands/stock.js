const { SlashCommandBuilder, time } = require("discord.js")
const GamesModel = require('../models/games.js')

module.exports = {
    // Set up the /stock command and its title option
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Check if a game is in stock at The Rolling Die')
        .addStringOption(option => 
            option.setName('title')
            .setDescription('Title of the board game')
            .setRequired(true)),
    async execute(interaction, io) {
        // Get the game title entered by the user
        const title = interaction.options.getString('title');
        // Search for the game in the database
        const game = await GamesModel.findGameByTitle(title);

        let replyText = '';

        // Check if the game was found
        if (!game) {
            replyText = `We could not find any game matching '${title}'.`;
        } else if (game.stock > 0) {
            // Show how many copies are available
            replyText = `${game.title} is IN STOCK (${game.stock} copies available)`
        } else {
            // Tell the user the game is out of stock
            replyText = `${game.title} is currently OUT OF STOCK.`;
        }

        // Send the result to Discord
        await interaction.reply(replyText);

        // Send the command details to the activity log
        io.emit('botactivity', {
            user: interaction.user.username,
            command: '/stock',
            details: `title: ${title}`,
            reply: replyText,
            time: new Date().toLocaleTimeString()
        });
    },
};