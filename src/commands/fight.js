const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { rng } = require(`../config/functions`);

module.exports = {
    name: `fight`,
    description: `Fight powerful foes!`,
    usage: null,
    cooldown: 30,
    aliases: [`f`]
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let fleshPickup, bonesPickup, stringPickup, gunpowderPickup, pearlsPickup;
    let pickupTxt = `${m} You killed `;

    let spiders = [`spider ${emojis.spider}`, `cave spider ${emojis.caveSpider}`];
    let creepers = [`creeper ${emojis.creeper}`, `charged creeper ${emojis.chargedCreeper}`];

    let randSpider = spiders[rng(0, 1)];
    let randCreeper = creepers[0];
    if(rng(0, 9) == 0) randCreeper = creepers[1];

    switch(dbUser.equipped.sword) {
        case 0:
            fleshPickup = rng(5, 8);

            dbUser.drops.rottenFlesh += fleshPickup;

            pickupTxt += `a zombie ${emojis.zombie} with your ${emojis.woodSword} and got ${fleshPickup} ${emojis.rottenFlesh}`;
            break;
        case 1:
            bonesPickup = rng(6, 11);
    
            dbUser.drops.bone += bonesPickup;
    
            pickupTxt += `a skeleton ${emojis.skeleton} with your ${emojis.stoneSword} and got ${bonesPickup} ${emojis.bone}`;
            break;
        case 2:
            stringPickup = rng(4, 15);
    
            dbUser.drops.string += stringPickup;

            pickupTxt += `a ${randSpider} with your ${emojis.ironSword} and got ${stringPickup} ${emojis.string}`;
            break;
        case 3:
            gunpowderPickup = rng(2, 18);
    
            dbUser.drops.gunpowder += gunpowderPickup;
    
            pickupTxt += `a ${randCreeper} with your ${emojis.goldSword} and got ${gunpowderPickup} ${emojis.gunpowder}`;
            break;
        case 4:
            pearlsPickup = rng(1, 5);
    
            dbUser.drops.enderPearl += pearlsPickup;
    
            pickupTxt += `an enderman ${emojis.enderman} with your ${emojis.diamondSword} and got ${pearlsPickup} ${emojis.enderPearl}`;
            break;
    }
 
    dbUser.stats.totalFights++;

    dbUser.save(err => message.channel.send(err ? `${m} There was an error executing that command.`: pickupTxt));
}