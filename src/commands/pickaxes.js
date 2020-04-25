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

    let pickTxt = ``;

    for(let i in dbUser.weapons.pickaxes) {
        let pick = dbUser.weapons.pickaxes[i];
        let pickEmoji = emojis[`${i}Pick`];

        if(pickEmoji && pick === true) pickTxt += `${pickEmoji} ${i.slice(0, 1).toUpperCase() + i.slice(1)} Pickaxe\n`;
    }

    let sEmbed = new Discord.RichEmbed()
        .setColor(0x1e90ff)
        .setAuthor(`Unlocked Pickaxes | ${discUser.tag}`)
        .setDescription(pickTxt)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}