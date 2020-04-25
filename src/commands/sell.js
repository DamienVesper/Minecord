const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/materials`);

module.exports = {
    name: `sell`,
    description: `Sell your ores and wood!`,
    usage: `<item | all>`,
    cooldown: null,
    aliases: null
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });
 
    let sellAmt = 0;
    if(args[0] === `all`) {

        let a = 0;
        let b = 0;
        let c = 0;

        for(let i in dbUser.ores) {
            if(typeof dbUser.ores[i] === `number` && prices[Object.keys(dbUser.ores)[a]]) {
                sellAmt += dbUser.ores[i] * prices[Object.keys(dbUser.ores)[a]];
                dbUser.ores[i] = 0;
            }
            a++;
        }
        for(let i in dbUser.wood) {
            if(typeof dbUser.wood[i] === `number` && prices[Object.keys(dbUser.ores)[b]]) {
                sellAmt += dbUser.wood[i] * prices[Object.keys(dbUser.wood)[b]];
                dbUser.wood[i] = 0;
            }
            b++;
        }
        for(let i in dbUser.drops) {
            if(typeof dbUser.drops[i] === `number` && prices[Object.keys(dbUser.drops)[c]]) {
                sellAmt += dbUser.drops[i] * prices[Object.keys(dbUser.drops)[c]];
                dbUser.drops[i] = 0;
            }
            c++;
        }

    }
    else {
        let item = args[0];
        if(!prices[item]) return message.channel.send(`${m} That item can't be sold!`);
        if(Object.keys(dbUser.ores).includes(item)) {
            sellAmt = dbUser.ores[item] * prices[item];
            dbUser.ores[item] = 0;
        }
        else if(Object.keys(dbUser.wood).includes(item)) {
            sellAmt = dbUser.wood[item] * prices[item];
            dbUser.wood[item] = 0;
        }
        else if(Object.keys(dbUser.drops).includes(item)) {
            sellAmt = dbUser.drops[item] * drops[item];
            dbUser.drops[item] = 0;
        }
    }

    dbUser.money += sellAmt;
    dbUser.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command.`: `You sold ${args[0] != `all` ? `all of your ${args[0]}`: `everything`} for \`$${sellAmt}\`!`}`));
}