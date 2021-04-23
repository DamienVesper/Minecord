const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { cleanse, standardize } = require(`../config/functions`);

module.exports = {
    name: `top`,
    description: `View top players.`,
    usage: `<cash | level>`,
    cooldown: null,
    aliases: [`leaderboard`, `lb`]
};

const lbs = [`cash`, `level`];

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    if (!lbs.includes(args[0])) {
        const sEmbed = new Discord.MessageEmbed()
            .setColor(0xcfcf53)
            .setAuthor(`Global Leaderboard`)
            .setDescription(`
                That is an invalid leaderboard!
                Valid leaderboards are \`${lbs.join(`\`, \``)}\`. 
            `);
        return message.channel.send(sEmbed);
    }

    const lb = [];
    const users = await User.find({});
    for (const i in users) {
        const user = users[i];
        if (client.users.get(user.discordID) && !config.developerIDs.includes(user.discordID) && !user.banned) {
            lb.push({
                bal: user.money,
                discordID: user.discordID,
                level: user.level
            });
        }
    }

    switch (args[0]) {
        case `cash`: case `money`: lb.sort((a, b) => a.bal - b.bal); break;
        case `level`: lb.sort((a, b) => a.level - b.level); break;
    }

    let lbTxt = ``;
    for (let i = 0; i < (lb.length < 10 ? lb.length : 10); i++) {
        lbTxt += `${i == 0 ? `🥇` : i == 1 ? `🥈` : i == 2 ? `🥉` : `\`${i + 1}\``} - ${cleanse(client.users.get(lb[i].discordID).tag)} - `;
        switch (args[0]) {
            case `cash`: case `money`: lbTxt += `\`$${standardize(lb[i].bal)}\``; break;
            case `level`: lbTxt += `\`${lb[i].level}\``; break;
        }
        lbTxt += `\n`;
    }

    const sEmbed = new Discord.MessageEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`${args[0].replace(/^\w/, f => f.toUpperCase())} Leaderboard`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const userRank = lb.indexOf({ discordID: message.author.id });
    if (userRank > 9) {
        lbTxt += `\n\n🎖️ \`${userRank + 1}\` - ${cleanse(client.users.get(lb[userRank].discordID).tag)}`;
        switch (args[0]) {
            case `cash`: case `money`: lbTxt += `$${standardize(lb[userRank].bal)}`; break;
            case `level`: lbTxt += lb[userRank].level; break;
        }
    }

    sEmbed.setDescription(lbTxt);
    return message.channel.send(sEmbed);
};
