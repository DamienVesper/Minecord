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
    aliases: null
}

const format = value => {
    return value;
}


module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let shopTxt = ``;
    let itemFamily = assigner.arg[args[0]];


    if(!itemFamily) {
        let sEmbed = new Discord.RichEmbed()
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
    let type = assigner.shops[Object.keys(assigner.arg).indexOf(args[0])];
    let typeLower = type.toLowerCase();

    for(let i in prices[typeLower]) {
        let item = prices[typeLower][i];
        if(!dbUser.weapons[typeLower][i]) shopTxt += `${emojis[i + itemFamily]} ${i.slice(0, 1).toUpperCase() + i.slice(1)} ${itemFamily == `Pick` ? `Pickaxe`: itemFamily} - ${(item[1] === `cash` ? `$`: ``) + format(item[0]) + (item[1] !== `cash` ? emojis[item[1]]: ``)} \n`;
    }

    let sEmbed = new Discord.RichEmbed()
        .setColor(0xffa500)
        .setAuthor(`Shop Menu | ${type}`)
        .setDescription(`Use \`${config.prefix}buy ${client.commands.get(`buy`).usage}\` to buy an item.\n\n${shopTxt}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}