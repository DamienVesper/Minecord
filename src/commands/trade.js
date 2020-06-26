const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/materials`);
const { getClosestMatch } = require(`../config/functions`);

module.exports = {
    name: `trade`,
    description: `Trade with a user.`,
    usage: `<user>`,
    cooldown: 60,
    aliases: null,
    dev: true
}

const calculateValue = items => {
    let value = 0;
    items.forEach(item => value += prices[item[0]] * item[1]);
    return value;
}
const matchItem = item => {
    let matches = [];
    for(let i in prices) {
        matches.push({
            item: i,
            similarity: getClosestMatch(prices[i], item)
        });
    }
    matches.sort((a, b) => parseFloat(a.similarity - b.similarity));
    return `${matches[0].item.toString().replace(/^\w/, f => f.toUpperCase()).split(/(?=[A-Z])/).join(` `)}"\`*?`;
}

module.exports.run = async(client, message, args) => { 
    const m = `${message.author} »`;
    const t = `**TRADER** »`;

    let subCommands = [`accept`, `add`, `remove`, `cancel`, `confirm`, `deny`];
    if(subCommands.includes(args[0])) return;

    const startUser = message.author;

    let discUser = message.mentions.members.first();
    if(!discUser) {
        discUser = args[0];
        if(isNaN(parseInt(discUser))) return message.channel.send(`${m} That is an invalid user ID!`);
        discUser = client.users.get(discUser);
    }

    let dbStarter = await User.findOne({ discordID: message.author.id });
    let dbAcceptor = await User.findOne({ discordID: discUser.id });

    if(!dbAcceptor) return message.channel.send(`${m} That user does not have an account!`);
    var tradeInfo = {
        starter: {
            items: [],
            confirmed: false
        },
        acceptor: {
            items: [],
            confirmed: false
        },
        cancelled: false
    }

    message.channel.send(`${discUser} » ${startUser} has requested to trade with you. Do \`${config.prefix} trade accept @${startUser.tag}\` to begin.`).then(() => {
        message.channel.awaitMessages(msg => msg.author.id == discUser.id, {
            max: 1,
            time: 3e6,
            errors: [`time`]
        }).then(collected => {
            let msg = collected.first();

            if(!msg.content.split(` `).includes(`accept`)) return message.channel.send(`${m} » Your trade was denied by the other user.`);

            const sendMsg = async(message, channelID) => {
                let sEmbed = new Discord.RichEmbed()
                    .setColor(0x1e90ff)
                    .setDescription(`
                    **Trade between ${startUser} and ${discUser}**:
        
                    To add an item to the trade, do \`${config.prefix}trade add <item> <amount>\`.
                    To remove an item, do \`${config.prefix}trade remove <item>\`.
        
                    Cancel the trade with \`${config.prefix}trade cancel\`.
                    `)
                    .setTimestamp(new Date())
                    .setFooter(config.footer);
        
                let condits = [tradeInfo.starter.items != [], tradeInfo.acceptor.items != []];
                if(!(!condits[0] && !condits[1])) {
                    let starterTxt = ``;
                    let acceptorTxt = ``;

                    tradeInfo.starter.items.forEach(f => starterTxt += `${emojis[f.name]} ${f.quantity}\n`);
                    tradeInfo.acceptor.items.forEach(f => acceptorTxt += `${emojis[f.name]} ${f.quantity}\n`);

                    sEmbed
                        .addField(message.author, condits[0] ? tradeInfo.starter.items.map(f => `${f.name}`): `N/A`, true)
                        .addField(discUser, condits[1] ? tradeInfo.acceptor.items.map(): `N/A`, true)
                        .addBlankField(true)
                        .addField(`Value`, `$${condits[0] ? calculateValue(tradeInfo.starter.items): 0}` , true)
                        .addField(`Value`, `$${condits[1] ? calculateValue(tradeInfo.acceptor.items): 0}`, true);
                }
                if(!tradeInfo[0].confirmed && !tradeInfo[1].confirmed) return await client.channels.get(channelID).send(sEmbed);
                else return message;
            }
            const updateTrade = (user, change, item, _quantity) => {
                let items = tradeInfo[change].items;
                if(change === 0) items.push({ item, quantity });

                let itemLoc = items.indexOf({ item });
                items.splice(itemLoc, itemLoc + 1);
            }
        
            do {
                sendMsg(message, message.channel.id).then(() => message.channel.awaitMessages(msg => (msg.author.id == discUser.id || msg.author.id == message.author.id) && message.content.slice(0, config.prefix + 5) == `${config.prefix}trade`), {
                    max: 1,
                    time: 3e6,
                    errors: [`time`]
                }).then(collected => {
                    let message = collected.first();
                    const args = message.content.slice(config.prefix.length).trim().split(/ +/g).slice(1);

                    const m = `${message.author} »`;
                    const _user = message.author.id == discUser.id ? 1: 0;

                    let item, quantity, itemPrice;
                    switch(args.shift()) {
                        case `add`:
                            if((args.length < 3)) return message.channel.send(`${m} Proper usage is \`${config.prefix}trade add <item> <quantity>\`.`);

                            item = args[0];
                            quantity = parseInt(args[1]);

                            if(!quantity || isNaN(quantity) || quantity <= 0) return message.channel.send(`${m} Proper usage is \`${config.prefix}trade add <item> <quantity>\`.`);

                            itemPrice = prices[item];
                            if(!itemPrice) return message.channel.send(`${m} That is an invalid item. Did you mean \`${config.prefix}trade add ${matchItem(item)}\`?`);

                            updateTrade(_user, 1, item, quantity);
                            break;
                        case `remove`:
                            if((args.length < 3)) return message.channel.send(`${m} Proper usage is \`${config.prefix}trade remove <item>\`.`);

                            item = args[0];

                            itemPrice = prices[item];
                            if(!itemPrice) return message.channel.send(`${m} That is an invalid item. Did you mean \`${config.prefix}trade add ${matchItem(item)}\`?`);
                            
                            updateTrade(_user, 0, item);
                            break;
                        case `cancel`:
                            tradeInfo.cancelled = true;
                            message.channel.send(`${t} Trade has been cancelled by ${message.author}.`);
                            break;
                        case `confirm`:
                            if(tradeInfo._user.confirmed) return message.channel.send(`${m} You have already confirmed the trade.`);
                            tradeInfo._user.confirmed = true;

                            if(tradeInfo[0].confirmed && tradeInfo[1].confirmed) return;

                            let sEmbed = new Discord.RichEmbed()
                                .setColor(0x1e90ff)
                                .setDescription(`
                                ${message.author} is confirming the trade.

                                Type \`${config.prefix}trade confirm\` to confirm.
                                Type \`${config.prefix}trade deny\` to deny.
                                `)
                                .setTimestamp(new Date())
                                .setFooter(config.footer);
                            return message.channel.send(sEmbed);
                        case `deny`:
                            if(!tradeInfo[0].confirmed && !tradeInfo[1].confirmed) return message.channel.send(`${m} There is no confirmation for the trade at this time.`);

                            tradeInfo[0].confirmed = false;
                            tradeInfo[1].confirmed = false;

                            message.channel.send(`${t} ${message.author} has denied the trade.`);
                            break;
                    }
                }).catch(() => {
                    message.channel.send(`${t} Trade has been cancelled due to inactivity.`);
                    tradeInfo.cancelled = true;
                });
            }
            while((!tradeInfo.starter.confirmed && !tradeInfo.acceptor.confirmed) && !tradeInfo.cancelled);

            tradeInfo.starter.confirmed = false;
            tradeInfo.acceptor.confirmed = false;

            tradeInfo.starter.items.forEach(f => {
                if(f.item == `money`) {
                    dbStarter.money -= f.quantity;
                    dbAcceptor.money += f.quantity;
                }
                else if(Object.keys(dbUser.ores).includes(f.item)) {
                    dbStarter.ores[f.item] -= f.quantity;
                    dbAcceptor.ores[f.item] += f.quantity;
                }
                else if(Object.keys(dbUser.wood).includes(f.item)) {
                    dbStarter.wood[f.item] -= f.quantity;
                    dbAcceptor.wood[f.item] += f.quantity;
                }
                else if(Object.keys(dbUser.drops).includes(f.item)) {
                    dbStarter.drops[f.item] -= f.quantity;
                    dbAcceptor.drops[f.item] += f.quantity;
                }
            });
            tradeInfo.acceptor.items.forEach(f => {
                if(f.item == `money`) {
                    dbStarter.money += f.quantity;
                    dbAcceptor.money -= f.quantity;
                }
                else if(Object.keys(dbUser.ores).includes(f.item)) {
                    dbStarter.ores[f.item] += f.quantity;
                    dbAcceptor.ores[f.item] -= f.quantity;
                }
                else if(Object.keys(dbUser.wood).includes(f.item)) {
                    dbStarter.wood[f.item] += f.quantity;
                    dbAcceptor.wood[f.item] -= f.quantity;
                }
                else if(Object.keys(dbUser.drops).includes(f.item)) {
                    dbStarter.drops[f.item] += f.quantity;
                    dbAcceptor.drops[f.item] -= f.quantity;
                }
            });

            dbStarter.save(err => err ? console.error(err): null);
            dbAcceptor.save(err => err ? console.error(err): null);

            // sendMsg(message, client.channels.get(config.logs.trades));
            message.channel.send(`${t} The trade has been completed.`);

        }).catch(err => message.channel.send(`${m} The other user didn't respond in time, trade has been cancelled.`));
    });
}