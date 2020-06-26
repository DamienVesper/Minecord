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
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    let stonePickup, coalPickup, ironPickup, goldPickup, diamondPickup, netheritePickup, expPickup;
    let pickupTxt = `${m} You mined `;


    if(dbUser.stats.totalMines % 100 == -10) {
        let num1 = rng(1, 20);  let num2 = rng(1, 20); let answer = num1 + num2;

      message.channel.send(`${m} Anti bot check. Complete this addition: \`${num1} + ${num2}\`.
Type the command \`m!verify <answer>\`.`);
    dbUser.stats.totalMines++;

    function verify(response) {
        switch(response){
            case `m!verify ${answer}`: message.channel.send(`${m} Verification complete! Have fun playing!`); while(dbUser.stats.totalMines % 100 !== 4) dbUser.stats.totalMines++; dbUser.save(); break;
            default: if(dbUser.stats.totalMines % 100 == 3) { 
            message.channel.send(`You failed the verification and have been banned for 24 hours.
*If you think this is a mistake, join the support server to be unbanned*
https://discord.gg/Mf4eBsD`);  
                dbUser.stats.totalMines++;
                dbUser.banned = true;
                setTimeout(() => { dbUser.banned = false; dbUser.save() }, 86400000);
            }
            break;
        };
        dbUser.stats.totalMines++;
    }
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 86400000 });
        collector.on('collect', message => {
            if(dbUser.stats.totalMines % 100 == 4) return collector.stop(); 
            verify(message.content.toLowerCase());
            dbUser.save();
        });
    }

    //if(dbUser.stats.totalMines % 100 < 4) return message.channel.send(`${m} Please complete the previous verification(s) first.`);

    switch(dbUser.equipped.pickaxe) {
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
        case 5:
            netheritePickup = rng(11, 19);
            diamondPickup = rng(17, 31);
            goldPickup = rng(31, 47);
            ironPickup = rng(46, 62);
            coalPickup = rng(81, 110);
            stonePickup = rng(162, 220);

            dbUser.ores.netherite += netheritePickup;
            dbUser.ores.diamond += diamondPickup;
            dbUser.ores.gold += goldPickup;
            dbUser.ores.iron += ironPickup;
            dbUser.ores.stone += stonePickup;
            dbUser.ores.coal += coalPickup;

            expPickup = rng(300, 400);
            pickupTxt += `${netheritePickup} ${emojis.netherite}, ${diamondPickup} ${emojis.diamond}, ${goldPickup} ${emojis.gold}, ${ironPickup} ${emojis.iron}, ${stonePickup} ${emojis.stone}, and ${coalPickup} ${emojis.coal} with your ${emojis.netheritePick}`;
            break;
        case 6:

            let ores = [`stone`, `coal`, `stone`, `coal`];

            if(dbUser.weapons.pickaxes.stone == true) ores.push(`iron`);
            if(dbUser.weapons.pickaxes.iron == true) ores.push(`iron`, `gold`);
            if(dbUser.weapons.pickaxes.gold == true) ores.push(`gold`);
            if(dbUser.weapons.pickaxes.diamond == true) ores.push(`diamond`);
            if(dbUser.weapons.pickaxes.netherite == true) ores.push(`netherite`);
            if(dbUser.weapons.pickaxes.rainbow == true) ores.push(`coal`, `iron`, `prisms`);

            let mysteryPickup = rng(0, 500);
            let mysteryDrop = ores[rng(0, 9)];

            dbUser.ores[mysteryDrop] += mysteryPickup;

            expPickup = rng(100, 350);
            pickupTxt += `${mysteryPickup} ${emojis[mysteryDrop]} with your ${emojis.mysteryPick}`;
            break;
        case 7:

            let prismPickup = rng(11, 20);

            dbUser.ores.prisms += prismPickup

            expPickup = rng(100, 350);
            pickupTxt += `${prismPickup} ${emojis.prism} with your ${emojis.rainbowPick}`;
            break;
    }

    
    let xpNeeded = Math.floor((100 * Math.E * dbUser.level) / 2);
    
    let xpMultiplier = 0;
    for(let i = dbUser.drops.netherStars; i--; i = 0) {
        xpMultiplier += (xpNeeded * (0.05 * Math.sqrt(i))) / 100;
    }

    dbUser.stats.totalMines++;
    dbUser.xp += Math.round((expPickup / 10) + (xpMultiplier));
    
    if(dbUser.xp > xpNeeded) {
        dbUser.level++;
        dbUser.xp -= xpNeeded;
        dbUser.ores.emerald += dbUser.level;
        message.channel.send(`${m} You just leveled up to level **${dbUser.level}**! You have received ${dbUser.level + emojis.emerald}!`);
    }
    dbUser.save(err => message.channel.send(err ? `${m} There was an error executing that command.
${err}`: pickupTxt));
}