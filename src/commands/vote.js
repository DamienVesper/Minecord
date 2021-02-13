const Discord = require(`discord.js`);
const { config } = require(`../index.js`);

module.exports = {
    name: `vote`,
    description: `Vote for money.`,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const embed = new Discord.RichEmbed()
        .setColor(0xffa500)
        .setAuthor(`Vote for Minecord`)
        .setThumbnail(`https://cdn.glitch.com/12fce8e2-cbfb-4596-aeea-096e3feba0df%2F669963346530795526.png?v=1579820875106`)
        .setDescription(`[Click here to vote to support Minecord!](https://top.gg/bot/625363818968776705/vote)`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(embed);
};
