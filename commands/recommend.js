const { SlashCommandBuilder } = require('discord.js');
const GamesModel = require('../models/games.js');

module.exports = {
    // Set up the /recommend command and its options
    data: new SlashCommandBuilder()
        .setName('recommend')
        .setDescription('Recommend games by category and maximum price')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('Category (e.g. Strategy, Family, Party, Co-op)')
                .setRequired(true))
        .addNumberOption(option => 
            option.setName('maxprice')
                .setDescription('Maximum price budget')
                .setRequired(true)),

        async execute(interaction, io) {
            // Get the category and maximum price entered by the user
            const category = interaction.options.getString('category');
            const maxprice = interaction.options.getNumber('maxprice');
            // Find games that match the category and price
            const games = await GamesModel.filterGames(category, maxprice);

            let replyText = '';

            // Check if any matching games were found
            if (!games || games.length === 0) {
                replyText = `No ${category} games found under $${maxprice}.`;
            } else {
                // Create a list of matching games with their price and stock
                const list = games.map(g => `${g.title} ($${g.price.toFixed(2)}, ${g.stock} in stock)`).join(' | ');
                replyText = `Found ${games.length} matching game(s): ${list}`;
            }

            // Send the results to Discord
            await interaction.reply(replyText);

            // Send the command details to the activity log
            io.emit('botactivity', {
                user: interaction.user.username,
                command: '/recommend',
                details: `category: ${category}, maxprice: $${maxprice}`,
                reply: replyText,
                time: new Date().toLocaleTimeString()
            });
        },
};