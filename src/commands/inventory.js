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

    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`User Inventory | ${discUser.tag}`)
        .setColor(0xffe200)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    if(woodTxt === `` && oreTxt === ``) sEmbed.setDescription(`This user has nothing!`);
    else {
        sEmbed.addField(`Drops`, dropTxt === `` ? `None`: dropTxt, true)
        sEmbed.addField(`Wood`, woodTxt === `` ? `None`: woodTxt, true)
        sEmbed.addField(`Ore`, oreTxt === `` ? `None`: oreTxt, true)
    }
    return message.channel.send(sEmbed);
}