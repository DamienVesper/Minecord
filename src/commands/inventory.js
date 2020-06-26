const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);


module.exports = {
    name: `inventory`,
    description: `View a user's inventory.`,
    usage: `[user]`,
    cooldown: null,
    aliases: [`inv`, `i`]
}

let calculateMaxExp = level => { return Math.floor((100 * Math.E * level) / 2); }
const standardize = num => {
    return Math.abs(Number(num)) >= 1.0e+21 ? (Math.abs(Number(num)) / 1.0e+21).toFixed(2) + "S" :
        Math.abs(Number(num)) >= 1.0e+18 ? (Math.abs(Number(num)) / 1.0e+18).toFixed(2) + "QT" :
        Math.abs(Number(num)) >= 1.0e+15 ? (Math.abs(Number(num)) / 1.0e+15).toFixed(2) + "Q" :
        Math.abs(Number(num)) >= 1.0e+12 ? (Math.abs(Number(num)) / 1.0e+12).toFixed(2) + "T" :
        Math.abs(Number(num)) >= 1.0e+9 ? (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + "B" :
        Math.abs(Number(num)) >= 1.0e+6 ? (Math.abs(Number(num)) / 1.0e+6).toFixed(2) + "M" :
        Math.abs(Number(num)) >= 1.0e+3 ? (Math.abs(Number(num)) / 1.0e+3).toFixed(2) + "K" :
        Math.abs(Number(num));
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
    if(!dbUser) return message.channel.send(`${m} That user doesn't have an account!`);

    let msg = await message.channel.send(`${m} Fetching user inventory...`);

    let dropTxt = ``;
    let woodTxt = ``;
    let oreTxt = ``;

    for(let i in dbUser.drops) {
        let item = dbUser.drops[i];
        if(typeof item === `number` && item > 0) dropTxt += `${emojis[i]} ${item}\n`;
    }
    for(let i in dbUser.wood) {
        let item = dbUser.wood[i];
        if(typeof item === `number` && item > 0) woodTxt += `${emojis[i]} ${item}\n`;
    }
    for(let i in dbUser.ores) {
        let item = dbUser.ores[i];
        if(typeof item === `number` && item > 0) oreTxt += `${emojis[i]} ${item}\n`;
    }

    let toolsText = ``;
    switch(dbUser.equipped.sword) {
        case 0: toolsText += emojis.woodSword; break;
        case 1: toolsText += emojis.stoneSword; break;
        case 2: toolsText += emojis.ironSword; break;
        case 3: toolsText += emojis.goldSword; break;
        case 4: toolsText += emojis.diamondSword; break;
        case 5: toolsText += emojis.netheriteSword; break;
    }
    switch(dbUser.equipped.pickaxe) {
        case 0: toolsText += emojis.woodPick; break;
        case 1: toolsText += emojis.stonePick; break;
        case 2: toolsText += emojis.ironPick; break;
        case 3: toolsText += emojis.goldPick; break; 
        case 4: toolsText += emojis.diamondPick; break;
        case 5: toolsText += emojis.netheritePick; break;
        case 6: toolsText += emojis.mysteryPick; break;
        case 7: toolsText += emojis.rainbowPick; break;
    }
    switch(dbUser.equipped.axe) {
        case 0: toolsText += emojis.woodAxe; break;
        case 1: toolsText += emojis.stoneAxe; break;
        case 2: toolsText += emojis.ironAxe; break;
        case 3: toolsText += emojis.goldAxe; break;
        case 4: toolsText += emojis.diamondAxe; break;
        case 5: toolsText += emojis.netheriteAxe; break;
        case 6: toolsText += emojis.fireAxe; break;
        case 7: toolsText += emojis.battleAxe; break;
    }

    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`User Inventory | ${discUser.tag}`)
        .setColor(dbUser.banned ? 0x000000: 0xcfcf53)
        .setTimestamp(new Date())
        .setFooter(config.footer)
        .addField(`Tools & Value`, `
            Tools: ${toolsText}
            Money: $${standardize(dbUser.money)}

            Level: ${dbUser.level}
            XP: ${standardize(Math.round(dbUser.xp))} / ${standardize(calculateMaxExp(dbUser.level))}
        `, true)
        .addField(`Stats`, `
            Times Mined: ${dbUser.stats.totalMines}
            Times Chopped: ${dbUser.stats.totalChops}
            Times Fought: ${dbUser.stats.totalFights}
        `, true)
        .addField('\u200b', '\u200b');

    if(woodTxt === `` && oreTxt === ``) sEmbed.setDescription(`This user has nothing!`);
    else {
        sEmbed.addField(`Drops`, dropTxt === `` ? `None`: dropTxt, true)
        sEmbed.addField(`Wood`, woodTxt === `` ? `None`: woodTxt, true)
        sEmbed.addField(`Ore`, oreTxt === `` ? `None`: oreTxt, true)
    }
    msg.edit(sEmbed);
}