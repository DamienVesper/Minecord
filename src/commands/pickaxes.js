const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `pickaxes`,
    description: `View available pickaxes.`,
    usage: null,
    cooldown: null,
    aliases: [`picks`]
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

    let pickTxt = ``;

    for (const i in dbUser.weapons.pickaxes) {
        const pick = dbUser.weapons.pickaxes[i];
        const pickEmoji = emojis[`${i}Pick`];

        if (pickEmoji && pick === true) pickTxt += `${pickEmoji} ${i.slice(0, 1).toUpperCase() + i.slice(1)} Pickaxe\n`;
    }

    const sEmbed = new Discord.MessageEmbed()
        .setColor(0x1e90ff)
        .setAuthor(`Unlocked Pickaxes | ${discUser.tag}`)
        .setDescription(pickTxt)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
