const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const Clan = require(`../models/clan.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/weapons`);
const { cleanse, standardize, calculateMaxExp } = require(`../config/functions`);

module.exports = {
    name: `profile`,
    description: `View a user's profile.`,
    usage: null,
    cooldown: null,
    aliases: [`p`, `user`, `info`]
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;

    let discUser;
    if (args[0]) {
        discUser = message.mentions.members.first();
        if (!discUser) {
            discUser = args[0];
            if (isNaN(parseInt(discUser))) return message.channel.send(`${m} That is an invalid user ID!`);
            discUser = client.users.get(discUser);
        }
        else discUser = discUser.user;
    }
    else discUser = message.author;

    const dbUser = await User.findOne({ discordID: discUser.id });
    if (!dbUser) return message.channel.send(`${m} That user doesn't have an account!`);

    let toolsTxt = ``;
    toolsTxt += emojis[`${Object.keys(prices.swords)[dbUser.equipped.sword]}Sword`];
    toolsTxt += emojis[`${Object.keys(prices.pickaxes)[dbUser.equipped.pickaxe]}Pick`];
    toolsTxt += emojis[`${Object.keys(prices.axes)[dbUser.equipped.axe]}Axe`];

    const clan = dbUser.clan ? await Clan.findById(dbUser.clan) : null;

    const sEmbed = new Discord.RichEmbed()
        .setColor(0xcfcf53)
        .setAuthor(`User Profile | ${discUser.tag}`, discUser.avatarURL)
        .setDescription(`
        ${clan ? `Clan: ${cleanse(clan.name)}` : `This user is not in a clan!`}

        Tools: ${toolsTxt}
        Money: $${standardize(dbUser.money)}

        Level: ${dbUser.level}
        XP: ${standardize(Math.round(dbUser.xp))} / ${standardize(calculateMaxExp(dbUser.level))}
        `)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
};
