const { SlashCommandBuilder, time } = require('discord.js')
const GamesModel = require('../models/games.js');
const { data, execute } = require('./stock.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('Look up the price and player count for a game')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the board game')
                .setRequired(true)),
    async execute(interaction, io) {
        const title = interaction.options.getString('title');
        const game = await GamesModel.findGameByTitle(title);

        let replyText = '';
        if (!game) {
            replyText = `We could not find '${title}' in out catalog.`
        } else {
            replyText = `${game.title} (${game.category}, ${game.players} players) is $${game.price.toFixed(2)}.`;
        }

        await interaction.reply(replyText);

        io.emit('botactivity', {
            user: interaction.user.username,
            command: '/price',
            details: `title: ${title}`,
            reply: replyText,
            time: new Date().toLocaleTimeString()
        });
    },
};