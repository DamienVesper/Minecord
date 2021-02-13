const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `support`,
    description: `Join the Minecord support server!`,
    usage: null,
    cooldown: null,
    aliases: [`server`]
};

module.exports.run = async (client, message, args) => {
    const embed = new Discord.RichEmbed()
        .setDescription(`**You can join our support server 
                    by clicking [here.](https://discord.gg/Mf4eBsD)**`)
        .setColor(0xCFCF53);
    message.channel.send(embed);
};
