const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const { config } = require(`../index.js`);
const { emojis } = require(`../config/emojis`);
const { prices } = require(`../config/prices/weapons`);
const { toCapitalString, standardize, addCommaSeparators } = require(`../config/functions`)

module.exports = {
    name: `info`,
    description: ``,
    usage: `<tool>`,
    cooldown: null,
    aliases: null,
    dev: true
}

module.exports.run = async(client, message, args) => {
    const m = `${message.author} »`;
    let dbUser = await User.findOne({ discordID: message.author.id });


    let toolType, priceTool, emojiSuffix;
    switch(args[1]) {
        case `sword`:
            priceTool = `swords`;            
            toolType = `Sword`;
            emojiSuffix = `Sword`;
            break;
        case `pickaxe`: case `pick`:
            priceTool = `pickaxes`;
            toolType = `Pickaxe`;
            emojiSuffix = `Pick`;
            break;
        case `axe`:
            priceTool = `axes`;
            toolType = `Axe`;
            emojiSuffix = `Axe`;
            break;
    }

    if(!prices[priceTool]) return message.channel.send(`${m} That tool doesn't exist!`);


    let item = prices[priceTool][args[0]];
    if(!item) return message.channel.send(`${m} That tool doesn't exist!`);

    let toolDesc = ``; let toolImg = ``;

    let toolInfo = {
            woodpickaxe: { color: 0xb87100, desc: `The most basic of pickaxes. Only mines a little **stone** ${emojis.stone} and **coal** ${emojis.coal}`},
            stonepickaxe: { color: 0x858585, desc: `A small upgrade to the players adventure, Mines a decent amount of **stone** ${emojis.stone} a little **coal** ${emojis.coal} and some **iron** ${emojis.iron}` },
            ironpickaxe: { color: 0xf5f1f1, desc: `This mighty upgrade will boost the players gameplay by a ton! Mines tons of **stone** ${emojis.stone} coal ${emojis.coal}, iron ${emojis.iron} and *shiny* **gold** ${emojis.gold}` },
            goldpickaxe: { color:0xffe200, desc: `This shiny and beautiful pickaxe will yield the player **stone**  ${emojis.stone} **coal** ${emojis.coal} **iron** ${emojis.iron} **gold** ${emojis.gold} and even **diamonds** ${emojis.diamond}`},
            ironpickaxe: { color: 0xf5f1f1, desc: `This mighty upgrade will boost the players gameplay by a ton! Mines tons of  **stone** ${emojis.stone} coal ${emojis.coal}, iron ${emojis.iron} and *shiny* **gold** ${emojis.gold}` },
            diamondpickaxe: { color: 0x009eff, desc: `Players who reached this pickaxe have a lot of dedication! This almighty pickaxe will mine tons of  **stone** ${emojis.stone} coal ${emojis.coal}, iron ${emojis.iron} **gold** ${emojis.gold} and **Diamonds** ${emojis.diamond}`},
            netheritepickaxe: { color: 0x773e92, desc: `The Netherite Pickaxe harvests the power of the Nether to mine a huge amount of ores, including **netherite** ${emojis.netherite}` },
            rainbowpickaxe: { color: 0xe500f, desc: `This magical pickaxe has been blessed by thousands of unicorns and leprechauns, with this magical power it mines **prisms** ${emojis.prism}`},
            mysterypickaxe: { color: 0xf5f1f1, desc: `This pickaxe yields mysterious powers, it's said that it gets more powerful if you own more pickaxes.`},

            woodaxe: { color: 0xb87100, desc: `The most basic of axes. Only chops basic **Oak** ${emojis.oak}` },
            stoneaxe: { color: 0x858585, desc: `A small upgrade to the players adventure, chops **oak** ${emojis.oak} and **birch** ${emojis.birch}` },
            ironaxe: { color: 0xf5f1f1, desc: `This mighty upgrade will boost the players gameplay by a ton! Chops **birch** ${emojis.birch} and **spruce** ${emojis.spruce}`},
            goldaxe: { color: 0xffe200, desc: `This shiny and beautiful axe will yield the player **spruce** ${emojis.spruce} and **jungle** ${emojis.jungle}` },
            diamondaxe: { color: 0x009eff, desc: `Players who reached this axe have a lot of dedication! This almighty axe will chop **jungle** ${emojis.jungle} and **acacia** ${emojis.acacia}`},
            netheriteaxe: { color: 0x773e92, desc: `The Netherite Axe harvests the power of the Nether to mine huge amounts of almost every wood.`},
            battleaxe: {color: 0xf5f1f1, desc: `This ancient viking axe has been sharpened by hundreds of viking black smiths and will yield the player both **birch** ${emoji.birch} and **string** ${emoji.string}`},
            fireaxe: { color: 0xff0000, desc: `This flamous axe can only be handled by a true firefighter, are you able to handle it and get yourself your well deserved **charcoal** ${emoji.charcoal}?` },

            woodsword: { color: 0xb87100, desc:`The most basic of swords. Only kills **zombies** ${emojis.zombie} which drop **rotten flesh** ${emojis.rottenFlesh}` }, 
            stonesword: { color: 0x858585, desc: `A small upgrade to the player's adventure, kills **skeletons** ${emojis.skeleton} and **strays** ${emojis.stray} from time to time, which drop **bones** ${emojis.bone}` },
            ironsword: { color: 0xf5f1f, desc: `This mighty upgrade will boost the players gameplay by a ton! Kills **spiders** ${emojis.spider} and sometimes the rare **spider jockey** ${emojis.spider} ${emojis.skeleton} which drop **string** ${emojis.string} and **bones** ${emojis.bone}` },
            goldsword: { color:0xffe200, desc: `This shiny and beautiful sword will yield the player **gunpowder** ${emojis.gunpowder} which is dropped by **creepers** ${emojis.creeper}` },
            diamondsword: { color: 0x009eff, desc:`Players who reached this sword have a lot of dedication! This almighty sword will kill **endermen** ${emojis.enderman} which drop a few **ender pearls** ${emojis.enderPearl}.` },
            netheritesword: { color: 0x773e92, desc: `The Netherite Sword harvests the power of the Nether to kill **shulkers** ${emoji.shulker} which drop **shulker shells** ${emojis.shulkerShell}`}
        };

    let embed = new Discord.RichEmbed()
    .setTitle(`***${toCapitalString(args[0])} ${toolType}***`)
    .addField(`${item[1] == `cash` ? `$${addCommaSeparators(item[0])}` : item[1] == `emerald` ? `${addCommaSeparators(item[0])} ${emojis.emerald}` : `\u200b`}`, toolInfo[args[0].toLowerCase() + toolType.toLowerCase()].desc)
    .setColor(toolInfo[args[0].toLowerCase() + toolType.toLowerCase()].color)
    .setThumbnail(`https://cdn.discordapp.com/emojis/${`${emojis[args[0] + emojiSuffix]}`.replace(/\D/g, "")}.png?v=1`);

    message.channel.send(embed);
}