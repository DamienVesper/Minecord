const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);

module.exports = {
    name: `dev`,
    description: `Developer commands.`,
    usage: null,
    cooldown: null,
    aliases: null,
    dev: true
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });

    if(!config.developerIDs.includes(message.author.id)) return message.channel.send(`${m} You can't use that!`);
    
    switch(args.shift()) {
        case `udelete`:
            if(!args[0]) return message.channel.send(`${m} Proper usage is \`${config.prefix}dev udelete <user_id>\`.`);

            const user = await User.findOne({ discordID: args[0] });
            if(!user) return message.channel.send(`${m} That user does not have an account!`);
            message.channel.send(`${m} Type \`yes\` to confirm account deletion.`).then(() => {
                message.channel.awaitMessages(a => a.author == message.author, {
                    max: 1,
                    time: 30000,
                    errors: [`time`]
            }).then(b => {
                if(b.first().content !== `yes`) return message.channel.send(`${m} Account deletion cancelled.`);
                User.deleteOne({ discordID: args[0] }).then(() => {
                    return message.channel.send(`${m} Deleted data for \`${args[0]}\`.`);
                });
            });
        });
        break;
        case `reload`:
            if(!args[0]) return message.channel.send(`${m} Proper usage is \`${config.prefix}dev reload <command>\`.`);

            let command = client.commands.get(args[0])|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

            delete require.cache[require.resolve(`./${command.name}.js`)];

            let reloadedCommand = require(`./${command.name}.js`);

            client.commands.set(reloadedCommand.name, reloadedCommand);
            message.channel.send(`${m} Command \`${command.name}.js\` was reloaded.`);

            break;
        case `give`:

    let giver = message.author

    let receiver;
    if(args[0]) {
        receiver = message.mentions.members.first();
        if(!receiver) {
            receiver = args[0];
            if(isNaN(parseInt(receiverr))) return message.channel.send(`${m} That is an invalid user ID!`);
            discUser = client.users.get(receiver);
        }
        else receiver = receiver.user;
    }
        if(!receiver) return message.channel.send(`${m} That user doesn't have an account!`);
        const m2 = `${receiver} »`;

    let dbReceiver = await User.findOne({ discordID: receiver.id });
    let dbGiver = await User.findOne({ discordID: giver.id });

    for(let i = 0; i<args.length; i++) { args[i] = args[i].toLowerCase(); }

    let item = args[1];
    
    switch(item) {
        case `money`:
            dbReceiver.money += Number(args[2]);
        break;
        default:
        if(Object.keys(dbGiver.ores).includes(item)) {
            dbReceiver.ores[item] += Number(args[2]);
        }
        else if(Object.keys(dbUser.wood).includes(item)) {
            dbReceiver.wood[item] += Number(args[2]);
        }
        else if(Object.keys(dbUser.drops).includes(item)) {
            dbReceiver.drops[item] += Number(args[2]);

        } else return('Could not locate item: ' + item);

        dbGiver.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command.`: `You gave ${args[2]} ${item} to ${receiver}`}`));
        dbReceiver.save(err => message.channel.send(`${err ? `${m2} There was an error executing that command.`: ``}`));
    }
        break;
        default: return message.channel.send(`${m} That dev command doesn't exist!`);
    }
}