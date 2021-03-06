const fs = require(`fs`);
const path = require(`path`);

const Discord = require(`discord.js`);

require(`dotenv`).config();

// Client configuration.
const { config } = require(`./config/config.js`);

const client = new Discord.Client({
    // disableEveryone: true,
    fetchAllMembers: true,
    sync: true
});

const mongoose = require(`mongoose`);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`Succesfully connected Mongoose to MongoDB.`)).catch(err => console.error(err));

// Arbitrary command loader.
client.commands = new Discord.Collection();
fs.readdir(path.resolve(__dirname, `commands`), (err, files) => {
    if (err) return console.error(err);

    files.forEach(f => {
        const props = require(`./commands/${f}`);
        client.commands.set(props.name, props);
    });

    console.log(`Loaded ${files.length} command${files.length === 1 ? `` : `s`}!`);
});

module.exports = {
    config,
    client
};

const User = require(`./models/user.model.js`);

// Client events.
client.on(`ready`, async () => {
    console.log(`${client.user.tag} has started, with ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);
    refreshActivity();
});

// Refreshing the client activity.
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
            message.channel.send(`${m} There was an error executing that command.`);
            console.log(err);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(() => console.error(`Failed to authenticate client with application.`));
