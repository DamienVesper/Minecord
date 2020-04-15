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
    const m = `${message.author} » `;

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

    let woodTxt = ``;
    if(dbUser.wood.oak > 0) woodTxt += `${emojis.oakLog} ${dbUser.wood.oak}\n`;
    if(dbUser.wood.birch > 0) woodTxt += `${emojis.birchLog} ${dbUser.wood.birch}\n`;
    if(dbUser.wood.spruce > 0) woodTxt += `${emojis.spruceLog} ${dbUser.wood.spruce}\n`;
    if(dbUser.wood.jungle > 0) woodTxt += `${emojis.jungleLog} ${dbUser.wood.jungle}\n`;
    if(dbUser.wood.acacia > 0) woodTxt += `${emojis.acaciaLog} ${dbUser.wood.acacia}\n`;

    let oreTxt = ``;
    if(dbUser.ores.stone > 0) oreTxt += `${emojis.stone} ${dbUser.ores.stone}\n`;
    if(dbUser.ores.coal > 0)  oreTxt += `${emojis.coal} ${dbUser.ores.coal}\n`;
    if(dbUser.ores.iron > 0)  oreTxt += `${emojis.iron} ${dbUser.ores.iron}\n`;
    if(dbUser.ores.gold > 0)  oreTxt += `${emojis.gold} ${dbUser.ores.gold}\n`;
    if(dbUser.ores.diamond > 0)  oreTxt += `${emojis.diamond} ${dbUser.ores.diamond}\n`;
    if(dbUser.ores.lapis > 0)  oreTxt += `${emojis.lapis} ${dbUser.ores.lapis}\n`;
    if(dbUser.ores.redstone > 0)  oreTxt += `${emojis.redstone} ${dbUser.ores.redstone}\n`;

    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`User Inventory | ${message.author.tag}`)
        .setColor(0x1e90ff)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    if(woodTxt === `` && oreTxt === ``) sEmbed.setDescription(`This user has nothing!`);
    else {
        sEmbed.addField(`Wood`, woodTxt === `` ? `None`: woodTxt, true)
        sEmbed.addField(`Ore`, oreTxt === `` ? `None`: oreTxt, true)
    }
    return message.channel.send(sEmbed);
}