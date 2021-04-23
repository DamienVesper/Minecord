const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);

module.exports = {
    name: `start`,
    description: `Start your adventure!`,
    usage: null,
    cooldown: null,
    aliases: null
};

module.exports.run = async (client, message, args) => {
    const m = `${message.author} »`;

    const userHasRegistered = await User.findOne({ discordID: message.author.id });
    if (userHasRegistered) return message.channel.send(`${m} You already have an account!`);
    const user = new User({
        banned: false,
        cooldowns: {
            chop: 0,
            fight: 0,
            mine: 0
        },
        discordID: message.author.id,
        equipped: {
            sword: 0,
            pickaxe: 0,
            axe: 0
        },
        money: 0,
        ores: {
            stone: 0,
            coal: 0,
            iron: 0,
            gold: 0,
            diamond: 0,
            lapis: 0,
            redstone: 0,
            emerald: 0,
            netherite: 0,
            prisms: 0
        },
        plants: {
            beetroot: 0,
            carrots: 0,
            melons: 0,
            pumpkins: 0,
            potatoes: 0,
            wheat: 0
        },
        seeds: {
            wheat: 0,
            pumpkin: 0,
            melon: 0,
            beetroot: 0
        },
        stats: {
            totalMines: 0,
            totalChops: 0,
            totalFights: 0
        },
        weapons: {
            swords: {
                wood: true,
                stone: false,
                iron: false,
                gold: false,
                diamond: false,
                netherite: false
            },
            pickaxes: {
                wood: true,
                stone: false,
                iron: false,
                gold: false,
                diamond: false,
                netherite: false,
                rainbow: false,
                mystery: false
            },
            axes: {
                wood: true,
                stone: false,
                iron: false,
                gold: false,
                diamond: false,
                netherite: false,
                fire: false,
                battle: false
            }
        },
        wood: {
            oak: 0,
            birch: 0,
            spruce: 0,
            acacia: 0,
            jungle: 0,
            charcoal: 0
        },
        drops: {
            rottenFlesh: 0,
            bone: 0,
            string: 0,
            gunpowder: 0,
            enderPearl: 0,
            shulkerShells: 0,
            netherStars: 0
        },
        xp: 0,
        level: 0
    });
    user.save(err => err
        ? console.log(err)
        : message.channel.send(`${m} You have received your ${emojis.woodSword} ${emojis.woodPick} ${emojis.woodAxe}.
Type \`m!mine\` \`m!fight\` \`m!chop\` to use them!`));
};
