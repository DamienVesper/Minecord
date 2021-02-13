const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);

client.on(`guildRemove`, guild => {
    const sEmbed = new Discord.RichEmbed()
        .setColor(0xff0000)
        .setAuthor(`Left a Server`)
        .setDescription(`
            Name: ${guild.name}
            Owner: ${guild.owner.tag} (${guild.owner})
            Members: ${guild.memberCount}
        `)
        .setThumbnail(guild.iconURL)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return client.channels.get(config.logs.servers).send(sEmbed);
});
