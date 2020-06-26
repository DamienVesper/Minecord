const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { rng } = require(`../config/functions`);

module.exports = {
    name: `bossfight`,
    description: `Battle a powerful boss for loot!`,
    usage: `<wither>`,
    cooldown: 300,
    aliases: [`bf`]
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let witherPrice = dbUser.equipped.sword * 100;
    if(dbUser.ores.emerald < witherPrice)  return message.channel.send(`${m} You do not have enough emeralds ${emojis.emerald} to fight the Wither! (${dbUser.ores.emerald}/${witherPrice})`);

    let playerHealth = 5; let witherHealth = 10;

    function doWitherFight(swordTier) {

        let damages = [0.5, 1, 1.5];
        playerHealth -= damages[rng(0, 2)]; if(playerHealth < 0) playerHealth = 0;
        witherHealth -= (Math.ceil((swordTier + 1) * 2 / rng(4, 5) - rng(0, 1) / 2)); if(witherHealth < 0) witherHealth = 0;

        let witherHearts = ` `; for(let i=witherHealth; i > 0.5; i--) witherHearts+=`${emojis.heart}`; if(witherHealth % 1 == 0.5) { witherHearts+=`${emojis.halfHeart}` }; for(let i=witherHealth; i < 9.5; i++) witherHearts+=`${emojis.emptyHeart}`;

        let playerHearts = ` `; for(let i=playerHealth; i > 0.5; i--) playerHearts+=`${emojis.heart}`; if(playerHealth % 1 == 0.5) { playerHearts+=`${emojis.halfHeart}` }; for(let i=playerHealth; i < 4.5; i++) playerHearts+=`${emojis.emptyHeart}`;

        let swords = [`wood`, `stone`, `iron`, `gold`, `diamond`, `netherite`];


        message.channel.send(`${m} You hit the Wither ${emojis.wither} with your ${emojis[`${swords[dbUser.equipped.sword]}Sword`]}!
The Wither ${emojis.wither} attacks back!
Wither: ${witherHearts}
You: ${playerHearts}
${playerHealth <= 0 ? `You died! - *Better luck next time!*` : `${witherHealth <= 0 ? `You defeated the Wither! ${emojis.wither} You received **1 Nether Star**! ${emojis.netherStar}` : `*Type \`m!attack\` to attack again!*`}`}`)

        if(witherHealth <= 0 && playerHealth > 0) dbUser.drops.netherStars++;
        dbUser.save();
        };

        doWitherFight(dbUser.equipped.sword);

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id && m.content.toLowerCase() == `m!attack`, { time: 3600 * 1000 * 24 });
        collector.on('collect', message => { 
                doWitherFight(dbUser.equipped.sword > 4 ? 4 : dbUser.equipped.sword);
                if(playerHealth <= 0 || witherHealth <= 0) return collector.stop();
        });
dbUser.ores.emerald -= witherPrice;
dbUser.save();
}