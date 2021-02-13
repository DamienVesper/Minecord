const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/materials`);
const { standardize } = require(`../config/functions`);

module.exports = {
    name: `value`,
    description: `Check the value of your inventory!`,
    usage: `[user]`,
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
    if (!dbUser) return message.channel.send(`${m} That user doesn't have an account!`);

    const msg = await message.channel.send(`${m} Fetching user value...`);

    for (let i = 0; i < args.length; i++) { args[i] = args[i].toLowerCase(); }

    if (args[1]) { args[0] += args[1].replace(/^\w/, f => f.toUpperCase()); args.splice(args.length - 1); }

    let sellAmt = 0;

    let a = 0;
    let b = 0;
    let c = 0;

    for (const i in dbUser.ores) {
        if (typeof dbUser.ores[i] === `number` && prices[Object.keys(dbUser.ores)[a]]) {
            if (dbUser.ores[1] == `emerald`) return;
            sellAmt += dbUser.ores[i] * prices[Object.keys(dbUser.ores)[a]];
            dbUser.ores[i] = 0;
        }
        a++;
    }
    for (const i in dbUser.wood) {
        if (typeof dbUser.wood[i] === `number` && prices[Object.keys(dbUser.ores)[b]]) {
            sellAmt += dbUser.wood[i] * prices[Object.keys(dbUser.wood)[b]];
            dbUser.wood[i] = 0;
        }
        b++;
    }
    for (const i in dbUser.drops) {
        if (typeof dbUser.drops[i] === `number` && prices[Object.keys(dbUser.drops)[c]]) {
            sellAmt += dbUser.drops[i] * prices[Object.keys(dbUser.drops)[c]];
            dbUser.drops[i] = 0;
        }
        c++;
    }

    const lb = [];
    const users = await User.find({});
    for (const i in users) {
        const user = users[i];
        if (client.users.get(user.discordID) && user.discordID != `386940319666667521` && !user.banned) {
            lb.push({
                bal: user.money,
                discordID: user.discordID
            });
        }
    }

    lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1);

    let userRank;
    for (let i = 0; i < lb.length; i++) if (lb[i].discordID == message.author.id) userRank = i;

    const sEmbed = new Discord.RichEmbed()
        .setAuthor(`Value | ${discUser.tag}`)
        .setColor(0xffe200)
        .setTimestamp(new Date())
        .setFooter(config.footer)
        .addField(`Money Ranking: ${userRank + 1}`, `Item value: $${standardize(sellAmt)} \`($${sellAmt})\`
Balance: $${standardize(dbUser.money)} \`($${dbUser.money})\`
Total: $${standardize(dbUser.money + sellAmt)} \`($${dbUser.money + sellAmt})\`
`);

    msg.edit(sEmbed);
};
