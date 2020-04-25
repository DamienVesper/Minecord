const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `chop`,
    description: `Chop wood.`,
    usage: null,
    cooldown: 30,
    aliases: [`c`]
}

const rng = (min, max) => { return Math.floor(Math.random() * (max + 1 - min) + min); }

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let oakPickup, birchPickup, sprucePickup, acaciaPickup, expPickup;
    let pickupTxt = `${m} You chopped `;

    switch(dbUser.equipped.axe) {
        case 0:
            oakPickup = rng(5, 7);

            dbUser.wood.oak += oakPickup;

            expPickup = rng(40, 50);
            pickupTxt += `${oakPickup} ${emojis.oakLog} with your ${emojis.woodAxe}`;
            break;
        case 1:
            birchPickup = rng(10, 16);
            oakPickup = rng(7, 9);

            dbUser.wood.birch += birchPickup;
            dbUser.wood.oak += oakPickup;

            expPickup = rng(50, 60);
            pickupTxt += `${birchPickup} ${emojis.birchLog} and ${oakPickup} ${emojis.oakLog} with your ${emojis.stoneAxe}`;
            break;
        case 2:
            sprucePickup = rng(15, 21);
            birchPickup = rng(9, 14);

            dbUser.wood.spruce += sprucePickup;
            dbUser.wood.birch += birchPickup;

            expPickup = rng(60, 70);
            pickupTxt += `${sprucePickup} ${emojis.spruceLog} and ${birchPickup} ${emojis.birchLog} with your ${emojis.ironAxe}`;
            break;
        case 3:
            junglePickup = rng(30, 50);
            sprucePickup = rng(14, 19);

            dbUser.wood.jungle += junglePickup;
            dbUser.wood.spruce += sprucePickup;

            expPickup = rng(70, 80);
            pickupTxt += `${junglePickup} ${emojis.jungleLog} and ${sprucePickup} ${emojis.spruceLog} with your ${emojis.goldAxe}`;
            break;
        case 4:
            acaciaPickup = rng(20, 40);
            junglePickup = rng(60, 80)

            dbUser.wood.acacia += acaciaPickup;
            dbUser.wood.jungle += junglePickup;

            expPickup = rng(80, 100);
            pickupTxt += `${acaciaPickup} ${emojis.acaciaLog} and ${junglePickup} ${emojis.jungleLog} with your ${emojis.diamondAxe}`;
            break;
    }

    dbUser.xp += Math.round(expPickup / 10);
    dbUser.stats.totalChops += 1;

    dbUser.save(err => message.channel.send(err ? `${m} There was an error executing that command.`: pickupTxt));
}