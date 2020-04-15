const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `profile`,
    description: ``,
    usage: null,
    cooldown: null,
    aliases: []
}

let calculateMaxExp = level => { return (level + 1) * 100; }

module.exports.run = async(client, message, args) => {
    const m = `${message.author} » `;

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
    if(!dbUser) return message.channel.send(`${m} That user doesn't have an account!`);

    let toolsText = ``;
    switch(dbUser.equipped.sword) {
        case 0: toolsText += emojis.woodSword; break;
        case 1: toolsText += emojis.stoneSword; break;
        case 2: toolsText += emojis.ironSword; break;
        case 3: toolsText += emojis.goldSword; break;
        case 4: toolsText += emojis.diamondSword; break;
    }
    switch(dbUser.equipped.pickaxe) {
        case 0: toolsText += emojis.woodPick; break;
        case 1: toolsText += emojis.stonePick; break;
        case 2: toolsText += emojis.ironPick; break;
        case 3: toolsText += emojis.goldPick; break;
        case 4: toolsText += emojis.diamondPick; break;
    }
    switch(dbUser.equipped.axe) {
        case 0: toolsText += emojis.woodAxe; break;
        case 1: toolsText += emojis.stoneAxe; break;
        case 2: toolsText += emojis.ironAxe; break;
        case 3: toolsText += emojis.goldAxe; break;
        case 4: toolsText += emojis.diamondAxe; break;
    }

    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`User Profile | ${discUser.tag}`, discUser.avatarURL)
        .setColor(0x1e90ff)
        .addField(`Weapons & Value`, `
            Tools: ${toolsText}
            Money: $${dbUser.money}

            Level: ${dbUser.level}
            XP: ${dbUser.xp} / ${calculateMaxExp(dbUser.level)}
        `, true)
        .addField(`Stats`, `
            Times Mined: ${dbUser.stats.totalMines}
            Times Chopped: ${dbUser.stats.totalChops}
            Times Fought: ${dbUser.stats.totalFights}
        `, true)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}