const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `chop`,
    description: `Chop wood.`,
    usage: null,
    cooldown: 60,
    aliases: [`c`]
}

const rng = (min, max) => { return Math.floor(Math.random() * (max + 1 - min) + min); }

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let oakPickup, birchPickup, sprucePickup, acaciaPickup, expPickup, stringPickup;
    let pickupTxt = `${m} You chopped `;

    switch(dbUser.equipped.axe) {
        case 0:
            oakPickup = rng(5, 7);

            dbUser.wood.oak += oakPickup;

            expPickup = rng(40, 50);
            pickupTxt += `${oakPickup} ${emojis.oak} with your ${emojis.woodAxe}`;
            break;
        case 1:
            birchPickup = rng(10, 16);
            oakPickup = rng(7, 9);

            dbUser.wood.birch += birchPickup;
            dbUser.wood.oak += oakPickup;

            expPickup = rng(50, 60);
            pickupTxt += `${birchPickup} ${emojis.birch} and ${oakPickup} ${emojis.oak} with your ${emojis.stoneAxe}`;
            break;
        case 2:
            sprucePickup = rng(15, 21);
            birchPickup = rng(9, 14);

            dbUser.wood.spruce += sprucePickup;
            dbUser.wood.birch += birchPickup;

            expPickup = rng(60, 70);
            pickupTxt += `${sprucePickup} ${emojis.spruce} and ${birchPickup} ${emojis.birch} with your ${emojis.ironAxe}`;
            break;
        case 3:
            junglePickup = rng(30, 50);
            sprucePickup = rng(14, 19);

            dbUser.wood.jungle += junglePickup;
            dbUser.wood.spruce += sprucePickup;

            expPickup = rng(70, 80);
            pickupTxt += `${junglePickup} ${emojis.jungle} and ${sprucePickup} ${emojis.spruce} with your ${emojis.goldAxe}`;
            break;
        case 4:
            acaciaPickup = rng(20, 40);
            junglePickup = rng(60, 80);

            dbUser.wood.acacia += acaciaPickup;
            dbUser.wood.jungle += junglePickup;

            expPickup = rng(80, 100);
            pickupTxt += `${acaciaPickup} ${emojis.acacia} and ${junglePickup} ${emojis.jungle} with your ${emojis.diamondAxe}`;
            break;
        case 5:
            acaciaPickup = rng(20, 40);
            junglePickup = rng(60, 80);
            sprucePickup = rng(14, 19);
            birchPickup = rng(9, 14);

            dbUser.wood.acacia += acaciaPickup;
            dbUser.wood.jungle += junglePickup;
            dbUser.wood.spruce += sprucePickup;
            dbUser.wood.birch += birchPickup;

            expPickup = rng(80, 100);
            pickupTxt += `${acaciaPickup} ${emojis.acacia}, ${sprucePickup} ${emojis.spruce}, ${birchPickup} ${emojis.birch}, and ${junglePickup} ${emojis.jungle} with your ${emojis.netheriteAxe}`;
            break;
        case 6:
            charcoalPickup = rng(20, 40);

            dbUser.wood.charcoal += charcoalPickup;

            expPickup = rng(50, 80);
            pickupTxt += `${charcoalPickup} ${emojis.charcoal} with your ${emojis.fireAxe}`;
            break;
        case 7:
            sprucePickup = rng(15, 21);
            birchPickup = rng(9, 14);
            stringPickup = rng(2, 5);

            dbUser.wood.spruce += sprucePickup;
            dbUser.wood.birch += birchPickup;
            dbuser.drops.string += stringPickup;

            expPickup = rng(100, 120);
            pickupTxt += `${sprucePickup} ${emojis.spruce} and ${birchPickup} ${emojis.birch} with your ${emojis.battleAxe}
You also killed a spider ${emojis.spider} and got ${stringPickup} ${emojis.string}!`;
            break;
    }

    dbUser.xp += Math.round(expPickup / 10);
    dbUser.stats.totalChops += 1;

    dbUser.save(err => message.channel.send(err ? `${m} There was an error executing that command.`: pickupTxt));
}