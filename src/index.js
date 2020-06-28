/* Network-Installed Dependencies */
const Discord = require(`discord.js`);
const Math = require(`math.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();

/* Client Config */
const config = require(`./config/config`);
const emojis = require(`./config/emojis`)
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
});
client.on('guildCreate', guild => {
  let embed = new Discord.RichEmbed()
  embed.setColor(0x00ff00)
  embed.setAuthor('Joined a Server')
  embed.setDescription(`
Name: ${guild.name}
Owner: ${guild.owner.displayName} (${guild.owner})
Members: ${guild.memberCount}`)
embed.setThumbnail(guild.iconURL)
  embed.setTimestamp()
  client.shard.broadcastEval('client.shard.channels.get(`679776082186207401`) ? client.shard.channels.get(`679776082186207401`).send(embed) : console.log(`Could not locate channel.`);');
});
client.on('guildDelete', guild => {
  let embed = new Discord.RichEmbed()
  embed.setColor(0xff0000)
  embed.setAuthor('Left a Server')
  embed.setDescription(`
Name: ${guild.name}
Owner: ${guild.owner.displayName} (${guild.owner})
Members: ${guild.memberCount}`)
  embed.setThumbnail(guild.iconURL)
  embed.setTimestamp()
  client.shard.broadcastEval('client.shard.channels.get(`679776082186207401`) ? client.shard.channels.get(`679776082186207401`).send(embed) : console.log(`Could not locate channel.`);');
});

if(client.shard.id == 0) {
    const DBL = require(`dblapi.js`);
    const dbl = new DBL(process.env.DBL_TOKEN, {
            webhookPort: 5000,
            webhookAuth: process.env.WEBHOOK_AUTH
        }, client);

    dbl.webhook.on(`ready`, hook => {
        console.log(`Webhook running at https://${hook.hostname}:${hook.port + hook.path}.`);
    });
    dbl.webhook.on(`vote`, async vote => {
        let dbUser = await User.findOne({ discordID: vote.user });
        dbUser.ores.emerald += 10;
        let voteRewardMsg = `${client.users.get(vote.user).tag} just voted and received 10 emeralds ${emojis.emerald}`

        dbUser.save(err => client.channels.get(`653285446738116608`).send(err ? `There was an error processing a vote.`: voteRewardMsg));
    });

    client.shard.fetchClientValues(`guilds.size`).then(guildCount => setInterval(() => dbl.postStats(guildCount, client.shards.Id, client.shards.total), 18e5));
}

/* Client Commands */
client.events = new Discord.Collection();
fs.readdir(`${__dirname}/events/`, (err, files) => {
    if(err) console.error(err);

    let jsFiles = files.filter(f => f.split(`.`).pop() == `js`);
    if(jsFiles.length <= 0) return console.log(`No events to load!`);

    /* Load Commands */
    jsFiles.forEach(f => client.events.set(f.split(`.`)[0], require(`./events/${f}`)));
    // console.log(`[${client.shard.id}]: Loaded ${jsFiles.length} event${jsFiles.length === 1 ? ``: `s`}!`);
    console.log(`Loaded ${jsFiles.length} event${jsFiles.length === 1 ? null: `s`}!`);
});

/* Client Commands */
client.commands = new Discord.Collection();
fs.readdir(`${__dirname}/commands/`, (err, files) => {
    if(err) console.error(err);

    let jsFiles = files.filter(f => f.split(`.`).pop() == `js`);
    if(jsFiles.length <= 0) return console.log(`No commands to load!`);

    /* Load Commands */
    jsFiles.forEach(f => {
        let props = require(`./commands/${f}`);
        client.commands.set(props.name, props);
    });
    // console.log(`[${client.shard.id}]: Loaded ${jsFiles.length} command${jsFiles.length === 1 ? ``: `s`}!`);
    console.log(`Loaded ${jsFiles.length} command${jsFiles.length === 1 ? ``: `s`}!`);
});

/* Client Checks */
const refreshActivity = async() => {

	client.user.setPresence({
        game: {
            name: `Version ${config.version} | m!support`,
            type: `WATCHING`
        },
        status: `dnd`
	});
}

client.on(`message`, async message => {
    const m = `${message.author} » `;

    if(message.channel.id == `625357023315230764`) return;
    
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
            if(dbUser.banned) console.log(`[BANNED USER] ${message.author.tag} ran command ${command} in ${message.guild.name} [${message.guild.id}].`); if(dbUser.banned) return message.channel.send(`${m} You're banned, fool! <:GetBannedLol:653692630093266949>`);
            if(message.guild.id == `625357023315230760`) {
                const addRole = roleID => { message.member.addRole(message.guild.roles.get(roleID)); }
                const roles = [`625451047736836116`, `625451072152141825`, `625451095791108106`, `625451121976147969`, `625451142033309723`, `717532445213196380`, `724415595071799336`, `724415492281860116`];
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
            console.log(`${message.author.tag} ran command ${command} in ${message.guild.name} [${message.guild.id}].`);
            cmd.run(client, message, args);

            if(dbUser.stats.totalMines % 100 == 0) {
     
                let num1 = r(1, 20); let num2 = r(1, 20); let answer = num1 + num2;
                
                message.channel.send(`${message.author} » Anti bot check. Complete this addition: \`${num1} + ${num2}\`.
          Type the command \`m!verify <answer>\`.`);
                
                  const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 86400000 });
                  collector.on('collect', message => {
                      if (message.content.toLowerCase() == `m!verify ${answer}`) {
                        message.channel.send(`Verification complete! Have fun playing!`)
                        dbuser.stats.totalMines++;
                        collector.stop()
                      } else if (message.content.toLowerCase() != `m!verify ${answer}`) {
                        
                        collector.on('collect', message => {
                      if (message.content.toLowerCase() == `m!verify ${answer}`) collector.stop();
                      else if (message.content.toLowerCase() != `m!verify ${answer}`) {
                        
                        collector.on('collect', message => {
                      if (message.content.toLowerCase() == `m!verify ${answer}`) collector.stop();
                      else if (message.content.toLowerCase() != `m!verify ${answer}`) {
                        
                       message.channel.send(`You failed the verification and have been banned for 24 hours.
          *If you think this is a mistake, join the support server to be unbanned*
          https://discord.gg/Mf4eBsD`)
                        
                        .then(collector.stop())
                        dbUser.banned == true; dbuser.stats.totalMines++; setTimeout(() => { dbUser.banned = false; }, 86400000);
                      }
                  })
                      }
                        })
                      }     
                  })
              dbUser.save();
              } 
           }

        catch(err) { console.log(`There was an error executing command ${command} by ${message.author.tag}.`);
        message.channel.send(err)}
    }
});


client.login(config.token).catch(err => console.error(`Failed to authenticate client with application.`));
client.setMaxListeners(0);
