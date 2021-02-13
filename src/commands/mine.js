const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { rng } = require(`../config/functions`);

module.exports = {
    name: `mine`,
    description: `Mine for ore.`,
    usage: null,
    cooldown: 5,
    aliases: [`m`]
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });

    let stonePickup, coalPickup, ironPickup, goldPickup, diamondPickup, expPickup;
    let pickupTxt = `${m} You mined `;

    switch (dbUser.equipped.pickaxe) {
        case 0:
            stonePickup = rng(5, 8);
            coalPickup = rng(1, 3);

            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(10, 20);
            pickupTxt += `${stonePickup} ${emojis.stone} and ${coalPickup} ${emojis.coal} with your ${emojis.woodPick}`;
            break;
        case 1:
            ironPickup = rng(4, 11);
            stonePickup = rng(10, 17);
            coalPickup = rng(5, 8);

            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(20, 35);
            pickupTxt += `${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with your ${emojis.stonePick}`;
            break;
        case 2:
            goldPickup = rng(1, 5);
            ironPickup = rng(4, 11);
            coalPickup = rng(12, 16);
            stonePickup = rng(25, 37);

            dbUser.ores.gold += goldPickup;
            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(40, 70);
            pickupTxt += `${goldPickup} ${emojis.gold}, ${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with your ${emojis.ironPick}`;
            break;
        case 3:
            diamondPickup = rng(3, 7);
            goldPickup = rng(7, 12);
            ironPickup = rng(17, 28);
            coalPickup = rng(21, 34);
            stonePickup = rng(42, 69);

            dbUser.ores.diamond += diamondPickup;
            dbUser.ores.gold += goldPickup;
            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(80, 140);
            pickupTxt += `${diamondPickup} ${emojis.diamond}, ${goldPickup} ${emojis.gold}, ${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with your ${emojis.goldPick}`;
            break;
        case 4:
            diamondPickup = rng(11, 19);
            goldPickup = rng(17, 31);
            ironPickup = rng(31, 47);
            coalPickup = rng(46, 62);
            stonePickup = rng(81, 110);

            dbUser.ores.diamond += diamondPickup;
            dbUser.ores.gold += goldPickup;
            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(200, 250);
            pickupTxt += `${diamondPickup} ${emojis.diamond}, ${goldPickup} ${emojis.gold}, ${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with your ${emojis.diamondPick}`;
            break;
    }

    dbUser.xp += Math.round(expPickup / 10);
    dbUser.stats.totalMines++;

    const xpNeeded = Math.floor((100 * Math.E * dbUser.level) / 2);
    if (dbUser.xp > xpNeeded) {
        dbUser.level++;
        dbUser.xp -= xpNeeded;
        dbUser.ores.emerald += dbUser.level;
        message.channel.send(`${m} You just leveled up to level **${dbUser.level}**! You have received ${dbUser.level + emojis.emerald}!`);
    }
    dbUser.save(err => message.channel.send(err ? `${m} There was an error executing that command.` : pickupTxt));
};
