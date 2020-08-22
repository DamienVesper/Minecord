const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `unban`,
    description: `Unban a user.`,
    usage: `<user>`,
    cooldown: null,
    aliases: null,
    dev: true
}

const cleanse = str => { return str.replace(`\`\`\``, `\\\`\\\`\\\``).replace(`\``, `\\\``).replace(`||`, `\\|\\|`).replace(`_`, `\\_`).replace(`***`, `\\*\\*\\*`).replace(`**`, `\\*\\*`).replace(`*`, `\\*`); }

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    if(!config.developerIDs.includes(message.author.id) && !message.member.hasRole(`681226895349645314`)) return message.channel.send(`${m} You can't use that!`);

    let discUser;
    if(args[0]) {
        discUser = message.mentions.members.first();
        if(!discUser) {
            discUser = args[0];
            if(isNaN(parseInt(discUser))) return message.channel.send(`${m} That is an invalid user ID!`);
            discUser = client.users.get(discUser);
        }
        else discUser = discUser.user;
    }

    let dbUser = await User.findOne({ discordID: discUser.id });

    if(!dbUser) return message.channel.send(`${m} That user does not have an account!`);
    else if(!dbUser.banned) return message.channel.send(`${m} That user is not banned!`);

    dbUser.banned = false;
    dbUser.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command`: `Succesfully released \`${cleanse(client.users.get(dbUser.discordID).tag)}\`.`}`))
}