const User = require(`../models/user.model`);

const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);

client.on(`guildMemberAdd`, member => {
    if (member.guild.id == `625357023315230760`) client.channels.get(`625357023315230764`).send(`Welcome to the Minecord support server, ${member}. Please read <#625361214012129281> before continuing.`);
});
