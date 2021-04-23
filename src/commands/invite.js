const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `invite`,
    description: `Invite Minecord to your server!`,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription(`**[Invite Minecord to your server by clicking here!](https://discordapp.com/api/oauth2/authorize?client_id=625363818968776705&permissions=321536&scope=bot)**`)
        .setColor(0xCFCF53);
    message.channel.send(embed);
};
