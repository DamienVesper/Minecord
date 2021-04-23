const Discord = require(`discord.js`);
require(`dotenv`).config();

/* Client Config */
const config = require(`./config/config.js`);

const client = new Discord.Client({
    // disableEveryone: true,
    fetchAllMembers: true,
    sync: true
});

const mongoose = require(`mongoose`);
mongoose.connect(config.db.uri, config.db.uriParams).then(() => console.log(`Succesfully connected Mongoose to MongoDB.`)).catch(err => console.error(err));

module.exports = {
    config,
    client
};

const User = require(`./models/user.model.js`);

/* Client Events */
client.on(`ready`, async () => {
    console.log(`${client.user.tag} has started, with ${client.users.size} users in ${client.guilds.size} servers.`);
    refreshActivity();
});

/* Client Checks */
const refreshActivity = async () => {
    client.user.setPresence({
        game: {
            name: `${client.users.size} players on Minecord`,
            type: `WATCHING`
        },
        status: `dnd`
    });
};

client.on(`message`, async message => {
    const m = `${message.author} » `;

    // Message handling.
    if (message.author.bot || message.channel.type === `dm`) return;
    if (message.content.slice(0, config.prefix.length).toString().toLowerCase() !== config.prefix) return;

    // Argument handler.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Command validation.
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd || command === ``) return;

    if ((cmd.usage) && args.length < (cmd.usage.split(`<`).length) - 1) return message.channel.send(`${message.author} Proper usage is \`${config.prefix + cmd.name} ${cmd.usage}\`.`);
    else {
        const dbUser = await User.findOne({ discordID: message.author.id });
        if (!dbUser && command !== `start` && command !== `help`) return message.channel.send(`${m} You don't have an account yet!\n Do \`${config.prefix}start\` to begin your adventure!`);

        if (dbUser && command !== `start`) if (dbUser.banned) return message.channel.send(`${m} You're banned, fool! <:GetBannedLol:653692630093266949>`);

        if (dbUser && dbUser.cooldowns[cmd.name] !== undefined) {
            if (((new Date() - new Date(dbUser.cooldowns[cmd.name])) / 1000) < cmd.cooldown) return message.channel.send(`${m}You cannot ${cmd.name} for another \`${(((cmd.cooldown * 1000) + (new Date(dbUser.cooldowns[cmd.name]) - new Date())) / 1000).toFixed(1)}\` seconds.`);
            else {
                dbUser.cooldowns[cmd.name] = new Date();
                dbUser.save();
            }
        }

        try {
            console.log(`${message.author.tag} ran command ${command} in ${message.guild ? `${message.guild.name} [${message.guild.id}].` : ``}`);
            cmd.run(client, message, args);
        }

        catch (err) {
            console.log(`There was an error executing command ${command} by ${message.author.tag}.`);
            message.channel.send(err);
        }
    }
});

client.login(config.token).catch(() => console.error(`Failed to authenticate client with application.`));
