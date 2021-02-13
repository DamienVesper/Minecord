const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `axes`,
    description: `View available axes.`,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;

    let discUser;
    if (args[0]) {
        discUser = message.mentions.members.first();
        if (!discUser) {
            discUser = args[0];
            if (isNaN(parseInt(discUser))) return message.channel.send(`${m} That is an invalid user ID!`);
            discUser = client.users.get(discUser);
        }
        else discUser = discUser.user;
    }
    else discUser = message.author;

    const dbUser = await User.findOne({ discordID: discUser.id });

    let axeTxt = ``;

    for (const i in dbUser.weapons.axes) {
        const axe = dbUser.weapons.axes[i];
        const axeEmoji = emojis[`${i}Axe`];

        if (axeEmoji && axe === true) axeTxt += `${axeEmoji} ${i.slice(0, 1).toUpperCase() + i.slice(1)} Axe\n`;
    }

    const sEmbed = new Discord.RichEmbed()
        .setColor(0x1e90ff)
        .setAuthor(`Unlocked Axes | ${discUser.tag}`)
        .setDescription(axeTxt)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
