/* const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `help`,
    description: `View the help menu.`,
    usage: null,
    cooldown: null,
    aliases: [`?`]
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;

    let sEmbed = new Discord.MessageEmbed()
        .setColor(0xcccccc)
        .setAuthor(`Help Menu`, null, `https://minecorddocs.glitch.me/`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    client.commands.forEach(cmd => cmd.name != `` ? helpTxt += `\`${config.prefix + cmd.name} ${(cmd.usage !== null ? cmd.usage: ``)}\` - ${cmd.description}\n`: null);

    return message.channel.send(sEmbed);
}
*/
const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);

module.exports = {
    name: `help`,
    description: `View info about commands.`,
    usage: `[command name]`,
    cooldown: null,
    aliases: [`commands`, `?`, `h`]
};

module.exports.run = async (client, message, args) => {
    const v = `${message.author} »`;
    const commands = client.commands;
    const data = [];

    if (!args[0]) {
        let helpTxt = ``;
        commands.forEach(cmd => cmd.dev != true && cmd.name != `` ? helpTxt += `\`${config.prefix + cmd.name + (cmd.usage !== null ? ` ${cmd.usage}` : ``)}\` - ${cmd.description}\n` : null);

        const sEmbed = new Discord.MessageEmbed()
            .setColor(0xcfcf53)
            .setAuthor(`Help Menu`, null, `https://minecorddocs.glitch.me/`)
            .setDescription(helpTxt)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        return message.channel.send(sEmbed);
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command || command.name == `dev`) return message.channel.send(`${v} That is not a valid command!`);

    if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(`, `)}`);
    if (command.cooldown !== null) data.push(`**Cooldown:** ${command.cooldown} seconds.`);

    const sEmbed = new Discord.MessageEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`Help Menu | ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`)
        .setDescription(`${command.description}\n\n${data.join(`\n`)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
