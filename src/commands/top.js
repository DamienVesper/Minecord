const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `top`,
    description: `View top players.`,
    usage: `<cash | money | level | emeralds>`,
    cooldown: null,
    aliases: [`leaderboard`, `lb`]
}

cleanse = str => {
    return str
        .replace(`\`\`\``, `\\\`\\\`\\\``)
        .replace(`\``, `\\\``)
        .replace(`||`, `\\|\\|`)
        .replace(`_`, `\\_`)
        .replace(`***`, `\\*\\*\\*`)
        .replace(`**`, `\\*\\*`)
        .replace(`*`, `\\*`);
};
standardize = num => {
    return typeof num === `number` ? 
        Math.abs(Number(num)) >= 1.0e+21 ? (Math.abs(Number(num)) / 1.0e+21).toFixed(2) + "S" :
        Math.abs(Number(num)) >= 1.0e+18 ? (Math.abs(Number(num)) / 1.0e+18).toFixed(2) + "QT" :
        Math.abs(Number(num)) >= 1.0e+15 ? (Math.abs(Number(num)) / 1.0e+15).toFixed(2) + "Q" :
        Math.abs(Number(num)) >= 1.0e+12 ? (Math.abs(Number(num)) / 1.0e+12).toFixed(2) + "T" :
        Math.abs(Number(num)) >= 1.0e+9 ? (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + "B" :
        Math.abs(Number(num)) >= 1.0e+6 ? (Math.abs(Number(num)) / 1.0e+6).toFixed(2) + "M" :
        Math.abs(Number(num)) >= 1.0e+3 ? (Math.abs(Number(num)) / 1.0e+3).toFixed(2) + "K" :
        Math.abs(Number(num)): NaN;
};

const lbs = [`cash`, `level`, `money`, `emeralds`, `nether stars`, `stars`];

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    if(!lbs.includes(args[0])) {
        let sEmbed = new Discord.RichEmbed()
            .setColor(0xcfcf53)
            .setAuthor(`Global Leaderboard`)
            .setDescription(`
                That is an invalid leaderboard!
                Valid leaderboards are \`${lbs.join(`\`, \``)}\`. 
            `)
        return message.channel.send(sEmbed);
    }
    let msg = await message.channel.send(`${m} Fetching leaderboard...`);

    let lb = [];
    let users = await User.find({ banned: false });
    for(let i in users) {
        const push = () => {
            lb.push({
                bal: user.money,
                discordID: user.discordID,
                level: user.level,
                emeralds: user.ores.emerald,
                netherStars: user.drops.netherStars ? user.drops.netherStars : 0
            });
        }

        let user = users[i];
        if(user.discordID != `386940319666667521`) {
            switch(args[0]) {
                case `cash`: case `money`: user.money != 0 ? push(): null; break;
                case `level`: user.level != 0 ? push(): null; break;
                case `emeralds`: user.emeralds != 0 ? push(): null; break;
                case `nether`: case `stars`: user.netherStars != 0 ? push(): null; break;
            }
        }
    }
    
    switch(args[0]) {
        case `cash`: case `money`: lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1); break;
        case `level`: lb.sort((a, b) => (a.level <= b.level) ? 1 : -1); break;
        case `emeralds`: lb.sort((a, b) => (a.emeralds <= b.emeralds) ? 1 : -1); break;
        case `nether`: case `stars`:  lb.sort((a, b) => (a.netherStars <= b.netherStars) ? 1 : -1); break;
    }

    let lbTxt = ``;
    for(let i = 0; i < (lb.length < 10 ? lb.length: 10); i++) {
        lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `\`[${i + 1}]\``} - ${client.users.get(lb[i].discordID) ? cleanse(client.users.get(lb[i].discordID).tag) : `Data unavailable`} - `;
        switch(args[0]) {
            case `cash`: case `money`: lbTxt += `\`$${standardize(lb[i].bal)}\``; break; 
            case `level`: lbTxt += `\`${lb[i].level}\``; break;
            case `emeralds`: lbTxt += `\`${lb[i].emeralds}\`${emojis.emerald}`; break;
            case `nether`: case `stars`: lbTxt += `\`${lb[i].netherStars}\`${emojis.netherStar}`; break;
        }
        lbTxt += `\n`;
    }


    let sEmbed = new Discord.RichEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`${args[0].replace(/^\w/, f => f.toUpperCase())} Leaderboard`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    
    let userRank;
    for(let i = 0; i < lb.length; i++) if(lb[i].discordID == message.author.id) userRank = i;
    if(userRank > 9) {
        lbTxt += `.  .  .
        🎖️ \`[${userRank + 1}]\` - ${cleanse(client.users.get(lb[userRank].discordID).tag)}`;
        switch(args[0]) {
            case `cash`: case `money`: lbTxt += ` - \`$${standardize(lb[userRank].bal)}\``; break;
            case `level`: lbTxt += ` - \`${lb[userRank].level}\``; break;
            case `emeralds`: lbTxt += ` - \`${lb[userRank].emeralds}\`${emojis.emerald}`; break;
            case `nether`: case `stars`: lbTxt += ` - \`${lb[userRank].netherStars}\`${emojis.netherStar}`; break;
        }
    }

    sEmbed.setDescription(lbTxt);
    return msg.edit(sEmbed);
}
