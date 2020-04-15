const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);

module.exports = {
    name: `ping`,
    description: `View API response times.`,
    usage: null,
    cooldown: null,
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} » `;

    let msg = await message.channel.send(`Ping?`);

    let sEmbed = new Discord.RichEmbed()
        .setColor(0xffa500)
        .setAuthor(`Client Latency`)
        .setDescription(`
            API: \`${Math.round(client.ping)}ms\`
            Gateway: \`${msg.createdTimestamp - message.createdTimestamp}ms\`
        `)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    msg.edit(sEmbed);
}