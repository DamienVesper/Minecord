const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/materials`);
const { getClosestMatch, toCamelCase, toCapitalString } = require(`../config/functions`);

module.exports = {
    name: `give`,
    description: `Share some items with a friend.`,
    usage: `<user> <item> <amount>`,
    cooldown: 90,
    aliases: null
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;

    let giver = message.author

    let receiver;
    if(args[0]) {
        receiver = message.mentions.members.first();
        if(!receiver) {
            receiver = args[0];
            if(isNaN(parseInt(receiver))) return message.channel.send(`${m} That is an invalid user ID!`);
            receiver = client.users.get(receiver);
        }
        else receiver = receiver.user;
    }
        if(!receiver) return message.channel.send(`${m} That user doesn't have an account!`);

        if(receiver == giver) return message.channel.send(`${m} You cannot give items to yourself!`);
        const m2 = `${receiver} »`;
        let amount = args.pop()
    
        if(isNaN(amount) || amount < 0 ||  amount % 1 != 0) return message.channel.send(`${m} ${amount} is an invalid amount.`);

    let dbReceiver = await User.findOne({ discordID: receiver.id });
    let dbGiver = await User.findOne({ discordID: giver.id });

    for(let i = 0; i<args.length; i++) { args[i] = args[i].toLowerCase(); }
   // if(args[1]) { args[0] += args[1].replace(/^\w/, f => f.toUpperCase()); args.splice(args.length - 1); }

    args.shift();

    let item = toCamelCase(args);

    switch(item) {
        case `money`:
            if(amount > dbGiver.money) return message.channel.send(`${m} You do not have enough ${toCapitalString(item)} ${emojis[item] ? emojis[item] : ``}.`)
            dbReceiver.money += Number(amount);
            dbGiver.money -= Number(amount);
        break;
        case `emerald`:
            if(amount > dbGiver.ores[item]) return message.channel.send(`${m} You do not have enough ${toCapitalString(item)} ${emojis[item] ? emojis[item] : ``}.`)
            dbReceiver.ores[item] += Number(amount);
            dbGiver.ores[item] -= Number(amount);
        break;
        default:
        let matches = [];

        for(let i=0; i<Object.keys(prices).length; i++) {
                matches.push({ 
                    "item": Object.keys(prices)[i].toString(), 
                    "similarity": getClosestMatch(Object.keys(prices)[i], item) 
                });
        };

        matches.sort((a, b) => parseFloat(a.similarity) - parseFloat(b.similarity));

        if(!prices[item]) return message.channel.send(`${m} Did you mean:
*\`m!give @${receiver.tag} ${toCapitalString(matches[0].item)} ${amount}\`*?`);

        if(Object.keys(dbGiver.ores).includes(item)) {
            if(amount > dbGiver.ores[item]) return message.channel.send(`${m} You do not have enough ${toCapitalString(item)} ${emojis[item] ? emojis[item] : ``}.`)
            dbReceiver.ores[item] += Number(amount);
            dbGiver.ores[item] -= Number(amount);
        }
        else if(Object.keys(dbGiver.wood).includes(item)) {
            if(amount > dbGiver.wood[item]) return message.channel.send(`${m} You do not have enough ${toCapitalString(item)} ${emojis[item] ? emojis[item] : ``}.`)
            dbReceiver.wood[item] += Number(amount);
            dbGiver.wood[item] -= Number(amount); 
        }
        else if(Object.keys(dbGiver.drops).includes(item)) {
            if(amount > dbGiver.drops[item]) return message.channel.send(`${m} You do not have enough ${toCapitalString(item)} ${emojis[item] ? emojis[item] : ``}.`)
            dbReceiver.drops[item] += Number(amount);
            dbGiver.drops[item] -= Number(amount);

        } else return('Could not locate item: ' + item);

    }

        dbGiver.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command.`: `You gave ${amount} ${toCapitalString(item)} to ${receiver}`}`));
        dbReceiver.save(err => message.channel.send(`${err ? `${m2} There was an error executing that command.`: `Success!`}`));
}