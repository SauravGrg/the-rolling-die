const { SlashCommandBuilder, time } = require("discord.js")
const GamesModel = require('../models/games.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Check if a game is in stock at The Rolling Die')
        .addStringOption(option => 
            option.setName('title')
            .setDescription('Title of the board game')
            .setRequired(true)),
    async execute(interaction, io) {
        const title = interaction.options.getString('title');
        const game = await GamesModel.findGameByTitle(title);

        let replyText = '';
        if (!game) {
            replyText = `We could not find any game matching '${title}'.`;
        } else if (game.stock > 0) {
            replyText = `${game.title} is IN STOCK (${game.stock} copies available)`
        } else {
            replyText = `${game.title} is currently OUT OF STOCK.`;
        }

        await interaction.reply(replyText);

        io.emit('botactivity', {
            user: interaction.user.username,
            command: '/stock',
            details: `title: ${title}`,
            reply: replyText,
            time: new Date().toLocaleTimeString()
        });
    },
};