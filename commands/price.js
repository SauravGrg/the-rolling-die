const { SlashCommandBuilder} = require('discord.js')
const GamesModel = require('../models/games.js');

module.exports = {
    // Set up the /price command and its title option
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('Look up the price and player count for a game')
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
            replyText = `We could not find '${title}' in out catalog.`
        } else {
            // Show the game's category, players, and price
            replyText = `${game.title} (${game.category}, ${game.players} players) is $${game.price.toFixed(2)}.`;
        }

        // Send the reply to Discord
        await interaction.reply(replyText);

        // Send the command details to the activity log
        io.emit('botactivity', {
            user: interaction.user.username,
            command: '/price',
            details: `title: ${title}`,
            reply: replyText,
            time: new Date().toLocaleTimeString()
        });
    },
};