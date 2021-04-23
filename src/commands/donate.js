const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `donate`,
    description: `Support Minecord directly by donating!`,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });

    const sEmbed = new Discord.MessageEmbed()
        .setColor(0xffa500)
        .setAuthor(`Donate to Minecord`)
        .setThumbnail(`https://cdn.glitch.com/12fce8e2-cbfb-4596-aeea-096e3feba0df%2F669963346530795526.png?v=1579820875106`)
        .setDescription(`[Donate](https://patreon.com/panicakr/) to help support and keep Minecord going!`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
