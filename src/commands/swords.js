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
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;

    let discUser;
    if(args[0]) {
        discUser = message.mentions.members.first();
        if(!discUser) {
            discUser = args[0];
            if(isNaN(parseInt(discUser))) return message.channel.send(`${m} That is an invalid user ID!`);
            discUser = client.users.get(discUser);
        }
        else discUser = discUser.user;
    }
    else discUser = message.author;

    let dbUser = await User.findOne({ discordID: discUser.id });

    let swordTxt = ``;

    for(let i in dbUser.weapons.swords) {
        let sword = dbUser.weapons.swords[i];
        let swordEmoji = emojis[`${i}Sword`];

        if(swordEmoji && sword === true) swordTxt += `${swordEmoji} ${i.slice(0, 1).toUpperCase() + i.slice(1)} Sword\n`;
    }

    let sEmbed = new Discord.RichEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`Unlocked Swords | ${discUser.tag}`)
        .setDescription(swordTxt)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}