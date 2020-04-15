const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `mine`,
    description: `Mine for ore.`,
    usage: null,
    cooldown: 3,
    aliases: [`m`]
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} » `;

    let stonePickup, coalPickup, ironPickup, goldPickup, diamondPickup;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let pickupTxt = ``;
    switch(dbUser.equipped.pickaxe) {
        case 0:
            stonePickup = Math.floor((Math.random() * 6) + 3);
            coalPickup = Math.floor((Math.random() * 2) + 3)

            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            pickupTxt += `${m} You mined ${stonePickup} ${emojis.stone} and ${coalPickup} ${emojis.coal} with ${emojis.woodPick}`;
            break;
        case 1:
            ironPickup = Math.floor((Math.random() * 3) + 1);
            stonePickup = Math.floor((Math.random() * 8) + 10);
            coalPickup = Math.floor((Math.random() * 4) + 5);

            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            pickupTxt += `${m} You mined ${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with ${emojis.woodPick}`;
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
    }
    dbUser.stats.totalMines += 1;
    dbUser.save(err => err ? message.channel.send(`${m} There was an error running that command.`): message.channel.send(pickupTxt));
}