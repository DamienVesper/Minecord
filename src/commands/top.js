const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `top`,
    description: `View top players.`,
    usage: `<cash | level>`,
    cooldown: null,
    aliases: [`leaderboard`, `lb`]
}

const cleanse = str => { return str.replace(`\`\`\``, `\\\`\\\`\\\``).replace(`\``, `\\\``).replace(`||`, `\\|\\|`).replace(`_`, `\\_`).replace(`***`, `\\*\\*\\*`).replace(`**`, `\\*\\*`).replace(`*`, `\\*`); }
const standardize = num => {
    return Math.abs(Number(num)) >= 1.0e+9 ? (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + "B" :
        Math.abs(Number(num)) >= 1.0e+6 ? (Math.abs(Number(num)) / 1.0e+6).toFixed(2) + "M" :
        Math.abs(Number(num)) >= 1.0e+3 ? (Math.abs(Number(num)) / 1.0e+3).toFixed(2) + "K" :
        Math.abs(Number(num));
}

const lbs = [`cash`, `level`];

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

    let lb = [];
    let users = await User.find({});
    for(let i in users) {
        let user = users[i];
        lb.push({
            bal: user.money,
            discordID: user.discordID,
            level: user.level
        });
    }
    
    switch(args[0]) {
        case `cash`: case `money`: lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1); break;
        case `level`: lb.sort((a, b) => (a.level <= b.level) ? 1 : -1); break;
    }

    let lbTxt = ``;
    for(let i = 0; i < (lb.length < 10 ? lb.length: 10); i++) {
        lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `\`${i + 1}\``} - ${cleanse(client.users.get(lb[i].discordID).tag)} - `;
        switch(args[0]) {
            case `cash`:  case `money`: lbTxt += `$${standardize(lb[i].bal)}`; break;
            case `level`: lbTxt += lb[i].level; break;
        }
        lbTxt += `\n`;
    }


    let sEmbed = new Discord.RichEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`${args[0].replace(/^\w/, f => f.toUpperCase())} Leaderboard`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    
    let userRank;
    for(let i = 0; i < lb.length; i++) if(lb[i].id == message.author.id) userRank = i;
    if(userRank > 9) {
        lbTxt += `\n\n🎖️ \`${userRank + 1}\` - ${cleanse(client.users.get(lb[userRank].discordID).tag)}`;
        switch(args[0]) {
            case `cash`: case `money`: lbTxt += `$${standardize(lb[userRank].bal)}`; break;
            case `level`: lbTxt += lb[userRank].level; break;
        }
    }

    sEmbed.setDescription(lbTxt);
    return message.channel.send(sEmbed);
}