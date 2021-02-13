const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/weapons`);

module.exports = {
    name: `buy`,
    description: `Buy tools.`,
    usage: `<type> <tool>`,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });

    let toolType, priceTool, emojiSuffix;
    switch (args[1]) {
        case `sword`:
            priceTool = `swords`;
            toolType = `Sword`;
            emojiSuffix = `Sword`;
            break;
        case `pickaxe`:
            priceTool = `pickaxes`;
            toolType = `Pickaxe`;
            emojiSuffix = `Pick`;
            break;
        case `axe`:
            priceTool = `axes`;
            toolType = `Axe`;
            emojiSuffix = `Axe`;
            break;
    }

    if (!prices[priceTool]) return message.channel.send(`${m} That tool doesn't exist!`);

    const item = prices[priceTool][args[0]];
    if (!item) return message.channel.send(`${m} That tool doesn't exist!`);

    if (dbUser.weapons[priceTool][args[0]]) return message.channel.send(`${m} You already own that weapon!`);
    if (item[1] === `cash` && dbUser.money < item[0]) return message.channel.send(`${m} You don't have enough money for this item!`);
    if (item[1] === `emerald` && dbUser.ores.emerald < item[0]) return message.channel.send(`${m} You don't have enough emeralds ${emoji.emerald} for this item!`);

    dbUser.weapons[priceTool][args[0]] = true;
    if (item[1] === `cash`) dbUser.money -= item[0];
    if (item[1] === `emerald`) dbUser.ores.emerald -= item[0];

    dbUser.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command` : `You have succesfully bought ${emojis[args[0] + emojiSuffix]} for ${item[1] == `cash` ? `$` : ``}${item[0]}${item[1] != `cash` ? ` ${emojis[item[1]]}` : ``}`}.`));
};
