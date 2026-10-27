const { SlashCommandBuilder, time } = require('discord.js');
const GamesModel = require('../models/games.js');
const { data, execute } = require('./stock.js');

module.exports = {
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
            const category = interaction.options.getString('category');
            const maxprice = interaction.option.getNumber('maxprice');
            const games = await GamesModel.filterGames(category, maxprice);

            let replyText = '';
            if (games.length === 0) {
                replyText = `No ${category} games found under $${maxprice}.`;
            } else {
                const list = games.map(g => `${g.title} ($${g.price.toFixed(2)}, ${g.stock} in stock)`).join(' | ');
                replyText = `Found ${games.length} matching game(s): ${list}`;
            }

            await interaction.reply(replyText);

            io.emit('botactivity', {
                user: interaction.user.username,
                command: '/recommend',
                details: `category: ${category}, maxprice: $${maxprice}`,
                reply: replyText,
                time: new Date().toLocaleTimeString()
            });
        },
};