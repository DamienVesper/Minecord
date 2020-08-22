/* Network-Installed Dependencies */
const Discord = require(`discord.js`);
const Math = require(`math.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();

/* Client Config */
const config = require(`./config/config`);
const emojis = require(`./config/emojis`);
const client = new Discord.Client({
    // disableEveryone: true,
    fetchAllMembers: true, 
    sync: true
});

const mongoDB = require(`mongodb`);
const mongoose = require(`mongoose`);

mongoDB.connect(config.db.uri, config.db.uriParams).then(() => console.log(`Succesfully connected to MongoDB Atlas.`)).catch(err => console.error(err));
mongoose.connect(config.db.uri, config.db.uriParams).then(() => console.log(`Succesfully connected Mongoose to MongoDB.`)).catch(err => console.error(err));

module.exports = {
    config: config,
    client: client
}
const User = require(`./models/user.model`);

/* Client Events */
client.on(`ready`, async () => {
    console.log(`${client.user.username}#${client.user.discriminator} has started, with ${client.users.size} users in ${client.guilds.size} servers at ${config.hostname}.`);
    refreshActivity();
    
    let users = await User.find({});
    users.forEach(user => {
        user.ores.prisms = 0;
        user.wood.charcoal = 0;
        user.drops.netherStars = 0;
    
        user.weapons.pickaxes.rainbow = false;
        user.weapons.pickaxes.mystery = false;
        user.weapons.axes.fire = false;
        user.weapons.axes.battle = false;
    
    
        user.save(err => console.log(`[${user.discordID}] ${err ? `Error saving user data.`: `User data saved succesfully.`}`));
    });    
});

/* Client Checks */
const refreshActivity = async() => {
	client.user.setPresence({
        game: {
            name: `${client.users.size} players on Minecord`,
            type: `WATCHING`
        },
        status: `dnd`
	});
}

client.on(`message`, async message => {
    const m = `${message.author} » `;

    if(message.channel.id == `625357023315230764` || (message.guild && message.guild.id == `625357023315230760`)) return;
    
    /* Botception & Message Handling */
    if(message.author.bot || message.channel.type == `dm`) return;
    if(message.content.slice(0, config.prefix.length).toString().toLowerCase() != config.prefix) return;
//  if(!message.content.toLowerCase().startsWith(config.prefix)) return;

    /* Get Commands & Arguments */
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    /* Validate Commands */
    let cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if(!cmd || command === ``) return;
    else if((cmd.usage) && args.length < (cmd.usage.split(`<`).length) - 1) return message.channel.send(`${message.author} Proper usage is \`${config.prefix + cmd.name} ${cmd.usage}\`.`);
    else {
        let dbUser = await User.findOne({ discordID: message.author.id });
        if(!dbUser && command != `start` && command != `help`) return message.channel.send(`${m} You don't have an account yet!\n Do \`${config.prefix}start\` to begin your adventure!`);

        if(dbUser && command != `start`) {
            if(dbUser.banned) return message.channel.send(`${m} You're banned, fool! <:GetBannedLol:653692630093266949>`);
            if(message.guild && message.guild.id == `625357023315230760`) {
                const addRole = roleID => { message.member.addRole(message.guild.roles.get(roleID)); }
                const roles = [`625451047736836116`, `625451072152141825`, `625451095791108106`, `625451121976147969`, `625451142033309723`];
                addRole(roles[dbUser.equipped.pickaxe]);
            }
        }

        if(dbUser && dbUser.cooldowns[cmd.name] !== undefined) {
            if(((new Date() - new Date(dbUser.cooldowns[cmd.name])) / 1000) < cmd.cooldown) return message.channel.send(`${m}You cannot ${cmd.name} for another \`${(((cmd.cooldown * 1000) + (new Date(dbUser.cooldowns[cmd.name]) - new Date())) / 1000).toFixed(1)}\` seconds.`);
            else {
                dbUser.cooldowns[cmd.name] = new Date();
                dbUser.save();
            }
        }
    
        try {
            // console.log(`${message.author.tag} ran command ${command} in ${message.guild.name} [${message.guild.id}] on shard ${client.shard.id}.`);
            console.log(`${message.author.tag} ran command ${command} in ${message.guild ? `${message.guild.name} [${message.guild.id}].`: ``}`);
            cmd.run(client, message, args);
        }
        catch(err) { console.log(`There was an error executing command ${command} by ${message.author.tag}.`);
        message.channel.send(err)}
    }
});


client.login(config.token).catch(err => console.error(`Failed to authenticate client with application.`));
client.setMaxListeners(0);
