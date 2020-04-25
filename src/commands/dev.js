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
            message.channel.send(`${m} Command \`${command.name}.js\` was reloaded!`)

            break;
        default: return message.channel.send(`${m} That dev command doesn't exist!`);
    }
}