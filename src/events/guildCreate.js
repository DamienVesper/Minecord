const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);

client.on(`guildCreate`, guild => {
    const sEmbed = new Discord.RichEmbed()
        .setColor(0x00ff00)
        .setAuthor(`Joined a Server`)
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
