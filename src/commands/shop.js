const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/weapons`);
const { assigner } = require(`../config/shop`);

module.exports = {
    name: `shop`,
    description: `View the shop.`,
    usage: `[type]`,
    cooldown: null,
    aliases: null,
    dev: true
};

const format = value => {
    return value;
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });

    let shopTxt = ``;
    const itemFamily = assigner.arg[args[0]];

    if (!itemFamily) {
        const sEmbed = new Discord.MessageEmbed()
            .setColor(0xffa500)
            .setAuthor(`Shop Menu`)
            .setDescription(`
                **Available Shops**:
                ${assigner.shops.join(`\n`)}
            `)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        return message.channel.send(sEmbed);
    }
    const type = assigner.shops[Object.keys(assigner.arg).indexOf(args[0])];
    const typeLower = type.toLowerCase();

    for (const i in prices[typeLower]) {
        const item = prices[typeLower][i];
        if (!dbUser.weapons[typeLower][i]) shopTxt += `${emojis[i + itemFamily]} ${i.slice(0, 1).toUpperCase() + i.slice(1)} ${itemFamily == `Pick` ? `Pickaxe` : itemFamily} - ${(item[1] === `cash` ? `$` : ``) + format(item[0]) + (item[1] !== `cash` ? emojis[item[1]] : ``)} \n`;
    }

    const sEmbed = new Discord.MessageEmbed()
        .setColor(0xffa500)
        .setAuthor(`Shop Menu | ${type}`)
        .setDescription(`${shopTxt == `` ? `This shop is out of stock!` : `Use \`${config.prefix}buy ${client.commands.get(`buy`).usage}\` to buy an item.\n\n${shopTxt}`}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
