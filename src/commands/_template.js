const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: ``,
    description: ``,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });
};
