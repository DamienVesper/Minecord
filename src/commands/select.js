const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/weapons`);

module.exports = {
    name: `select`,
    description: `Select a weapon.`,
    usage: `<tool> <type>`,
    cooldown: null,
    aliases: null
}

const capitalize = str => { return str.replace(/^\w/, f => f.toUpperCase()); }

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let wepID = `${args[1]}s`;
    let wepEmoji = emojis[`${args[0]}${args[1] == `pickaxe` ? `Pick`: capitalize(args[1])}`];

    if(args[0] != `wood` && (!prices[wepID] || !prices[wepID][args[0]])) return message.channel.send(`${m} That weapon doesn't exist!`)
    else if(!dbUser.weapons[wepID][args[0]]) return message.channel.send(`${m} You don't own that ${args[1]}!`);

    dbUser.equipped[args[1]] = (Object.keys(prices[wepID]).indexOf(args[0])) + 1;
    dbUser.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command.`: `You have selected the ${capitalize(args[0])} ${capitalize(args[1])} ${wepEmoji}`}`));
}