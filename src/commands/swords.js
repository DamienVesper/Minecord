const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `swords`,
    description: `View available swords.`,
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

    let swordTxt = ``;

    for (const i in dbUser.weapons.swords) {
        const sword = dbUser.weapons.swords[i];
        const swordEmoji = emojis[`${i}Sword`];

        if (swordEmoji && sword === true) swordTxt += `${swordEmoji} ${i.slice(0, 1).toUpperCase() + i.slice(1)} Sword\n`;
    }

    const sEmbed = new Discord.RichEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`Unlocked Swords | ${discUser.tag}`)
        .setDescription(swordTxt)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
