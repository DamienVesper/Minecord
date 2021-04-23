const Discord = require(`discord.js`);

const User = require(`../models/user.model`);
const Clan = require(`../models/clan.model`);

const { config } = require(`../index.js`);

const { clanHelp } = require(`../config/clanHelp`);
const { cleanse } = require(`../config/functions`);

module.exports = {
    name: `clan`,
    description: `View info about clans.`,
    usage: null,
    cooldown: null,
    aliases: null
};

let clanHelpTxt = ``;
clanHelp.forEach(f => clanHelpTxt += `\`${config.prefix}clan ${f[0] + (f[2] ? ` <${f[2].join(`> <`)}>` : ``)}\` - ${f[1]}.\n`);

const viewClan = async (client, id) => {
    const clan = await Clan.findById(id);

    const clanMembers = clan.members;
    clanMembers.sort((a, b) => a.joined - b.joined);

    const sEmbed = new Discord.RichEmbed()
        .setColor(clan.color ? `#${clan.color}` : 0x000000)
        .setAuthor(cleanse(clan.name))
        .setDescription(clan.description ? cleanse(clan.description) : `This clan does not have a set description.`)
        .addField(`\u200B`, clanMembers.map(f => cleanse(client.users.get(f.discordID).tag)).join(`\n`))
        .setImage(clan.image || `https://cdn.glitch.com/12fce8e2-cbfb-4596-aeea-096e3feba0df%2F669963346530795526.png?v=1579820875106`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return sEmbed;
};

const getClanHelp = () => {
    const sEmbed = new Discord.RichEmbed()
        .setAuthor(`Clan Help`)
        .setDescription(`**All purchases use clan money.**\n\n${clanHelpTxt}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return sEmbed;
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;
    const dbUser = await User.findOne({ discordID: message.author.id });

    const arg = args.shift();
    if (arg === `info`) {
        let clanID;
        if (args[0]) clanID = Clan.findOne({ name: args.join(` `) });
        else if (dbUser.clan) clanID = dbUser.clan;
        else return message.channel.send(`${m} You are not currently in a clan!`);

        console.log(clanID);
        message.channel.send(await viewClan(client, dbUser.clan));
    } else if (arg === `create`) {
        if (args.length < 1) return message.channel.send(`Proper usage is \`${config.prefix}clan create <name>\`.`);
        if (dbUser.clan) return message.channel.send(`${m} You are already in a clan!`);
        if (dbUser.money < 1e5) return message.channel.send(`${m} You need at least \`$100K\` to create a clan!`);

        const clanName = args.join(` `);

        const clanExists = await Clan.findOne({ name: clanName });
        if (clanExists) return message.channel.send(`${m} A clan already exists with that name!`);

        const clan = new Clan({
            created: new Date(),
            name: clanName,
            balance: 0,
            members: [
                {
                    joined: new Date(),
                    type: 2,
                    balance: 0,
                    discordID: message.author.id
                }
            ]
        });
        clan.save(err => message.channel.send(`${m} ${err ? `There was an error executing that command.` : `You have created a clan! Do \`${config.prefix}clan info\` to view it!`}`));
    }
    else if (arg === `leave`) {
        if (!dbUser.clan) return message.channel.send(`${m} You are not in a clan!`);
        const clan = await Clan.findById(dbUser.clan);

        let clanMember;
        clan.members.forEach((f, i) => f.discordID = message.author.id ? clanMember = clan.members[i] : null);

        if (clanMember.type === 2) return message.channel.send(`${m} You cannot leave your clan if you are the owner!`);

        const memberIndex = clan.members.indexOf(clanMember);
        clan.members.splice(memberIndex, memberIndex + 1);
        dbUser.clan = null;

        clan.save(err => err ? console.error(err) : null);
        dbUser.save(err => err ? console.error(err) : null);

        message.channel.send(`${m} You have left clan \`${clan.name}\`.`);
    }
    else return message.channel.send(getClanHelp());
};
