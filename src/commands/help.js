const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);

module.exports = {
    name: `help`,
    description: `View the help menu.`,
    usage: null,
    cooldown: null,
    aliases: []
}

module.exports.run = async(client, message, args) => {
    let sEmbed = new Discord.RichEmbed()
      .setAuthor(`Help Menu`)
      .addField(`\u200B`, `
\`${config.prefix}start\` - Register.
\`${config.prefix}mine\` - Mine items.
\`${config.prefix}chop\` - Chop items.
\`${config.prefix}sell [item]\` - Sell items.
\`${config.prefix}shop [type]\` - View shops!
\`${config.prefix}buy [tool] [grade]\` - Buy items.
`, true)
      .addField(`\u200B`, `
\`${config.prefix}balance <user>\` - View a user's balance.
\`${config.prefix}cooldown\` - See your cooldowns.
\`${config.prefix}inventory <user>\` - Get a user's inventory.
\`${config.prefix}invite\` - Invite the bot!
\`${config.prefix}support\` - Join our support server!
`, true)
      .setTimestamp(new Date())
      .setFooter(config.footer);

    message.channel.send(sEmbed);
} 