const Discord = require('discord.js');
const client = require('../minecord.js');

const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');

function r(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

const e = require('../emojis.json')

function monize(labelValue) {
    // 9 zeroes = billions
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // 6 zeroes = millions
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // 3 zeroes = thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
// default
    : Math.abs(Number(labelValue))
}

module.exports = {
	name: 'clan',
  cooldown: 3,
	description: 'Create, view info on, or join someone else\'s clan!',
	execute(message, args) {
    
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ?");
  const { list } = require('../table.json');
  client.setScore = sql.prepare(list)
    
    let user = message.mentions.users.first() || message.author
  let score = client.getScore.get(message.author.id);
    let userscore = client.getScore.get(user.id);
  const v = `${message.author} »`
  
  let clanOwner;
  const clanOwnerData = sql.prepare("SELECT * FROM scores WHERE clanID=" + score.clanID + " AND clanRank=1").all();
    for(const data of clanOwnerData) {
    clanOwner = data.user
    }
    let cScore = client.getScore.get(clanOwner)
    
    if(cScore != null) {
    if(cScore.clanMemCount < 25) cScore.clanMemCount = 25
    client.setScore.run(cScore)
    }
if(!args[0] || args[0] === 'help') {
let embed = new Discord.RichEmbed()
.setAuthor('Clans', message.author.avatarURL)
.setDescription('**All purchases use clan money.**')
.addField('Commands', `
\`m!clan info\` - View information about your clan
\`m!clan create <name of clan>\` - Create a clan for $100,000
\`m!clan invite <user>\` - Invite a user to your clan
\`m!clan leave\` - Leave your clan (You cannot leave a clan you own yet)
\`m!clan donate <amount>\` - Add money to your clan balance
\`m!clan rename <new name>\` - Rename your clan for $50k
\`m!clan image <image link>\` - Change your clan image for $50k
\`m!clan color\` - View the color menu to change the color of your clan
\`m!clan promote <user>\` - Promote a user to clan moderator 
\`m!clan demote <user>\` - Demote a user from clan moderator 
\`m!clan kick <user>\` - Kick a user from your clan
\`m!clan description <new description>\` - Change your clan's description
\`m!clan upgrades\` - Upgrade your clan
`)
message.channel.send(embed)
}
    if(!args[0] || args[0] === 'help') return;
  if(isNaN(userscore.clanTier)) {
    userscore.clanCol = 'n'
    userscore.clanTier = 0
    userscore.clanDesc = '\u200b'
    client.setScore.run(userscore)
  }
    let clanMemberCount = 0;
    const memberC = sql.prepare("SELECT * FROM scores WHERE clanID=" + score.clanID).all();
    for(const data of memberC) {
        clanMemberCount += 1
    }

if(args[0] === 'create') {
  if(score.clanID === null) score.clanID = 0
    if(score.points < 100000) { message.channel.send(message.author + ' » It costs $100,000 to create a clan.') } else {
    if(score.clanID !== 0) { message.channel.send(message.author + ' » You are already in a clan!') } else {
      if(args.length === 1) {  message.channel.send(message.author + ' » You need to enter a clan name!') } else {
        
  let myNumber = 1
  let clanName = ''
        
  while (myNumber < args.length) {   // Execute until Infinity
  clanName += `${args[myNumber]} `
    myNumber++;
  }
        let bool;
        const all = sql.prepare("SELECT * FROM scores ORDER BY clanName").all();
    for(const data of all) {
      if(data.clanName === clanName) {
        bool=true
      }
    }
        if(bool === true) message.channel.send(v + ' Another clan already has that name!')
        if(bool === true) return;
        
  score.points -= 100000
  score.clanName = clanName
  score.clanRank = 1
  score.clanMemCount = 25
  score.clanFunds = 0
    
  const ids = sql.prepare("SELECT * FROM scores ORDER BY clanID DESC LIMIT 1").all();
    for(const data of ids) {
        score.clanID = data.clanID += 1
      client.setScore.run(score)
    }
    client.setScore.run(score)
  message.channel.send(`You have created the clan: \`${score.clanName}\``)
  }
        
    }
    }
}
    
    if(args[0] === 'invite') {
        const user2 = message.mentions.users.first()
  if(!user) { message.channel.send(message.author + ' » You have to mention someone!') } else {
  
  let inviter = message.author
  const calledClanName = score.clanName
  let userscore = client.getScore.get(user2.id)
  let scoreL = client.getScore.get(message.author.id)
  
  if(userscore.clanID === null) userscore.clanID = 0
  client.setScore.run(userscore)
    
  if(scoreL.clanRank !== 3 && scoreL.clanRank !== 1) { message.channel.send(v + ' You must be a clan moderator to invite someone.') } else {
  if(scoreL.clanID == 0 || score.clanID == null) { message.channel.send(message.author + ' » You are not in a clan!') } else {
  if(userscore.clanID !== 0) { message.channel.send(message.author + ' » This user is already in a clan.') } else {
  if(userscore.clanID === score.clanID) { message.channel.send(message.author + ' » This user is already in your clan.') } else {
  if(clanMemberCount === scoreL.clanMemCount) { message.channel.send(v + ' Your clan has reached the maximum number of members!') } else {
    
    message.channel.send(message.author + ` » Invite sent! 
${user}, type \`m!accept\` to join the clan **${calledClanName}**.
The invite expires in \`1 hour\`. Type \`m!decline\` to decline.`)
    const collector = new Discord.MessageCollector(message.channel, m => m.member.user.id === user.id, { time: 3600000 });
        collector.on('collect', message => {
          if(message.content.toLowerCase() === 'm!accept') {
              message.channel.send(message.author + ` » You have joined ${inviter}'s clan: \`${score.clanName}\`!`)
              let userscore = client.getScore.get(user.id)
              userscore.clanName = calledClanName
              userscore.clanRank = 2
              userscore.clanID = score.clanID
              client.setScore.run(userscore);
              collector.stop()
          }
          if(message.content.toLowerCase() === 'm!decline') {
            message.channel.send(message.author + ` » You have declined the invite to join the clan: \`${score.clanName}\``)
            collector.stop()
          }
        })
    }
    }
  }
  }
  }
  } 
    }
if(args[0] === 'rename'){
  if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the leader of the clan to rename it.') } else {
    
let ownerScore = client.getScore.get(clanOwner)
if(ownerScore.clanFunds < 50000) { message.channel.send(v + ` Your clan needs $50000 to rename it!
Add money to your clan balance with \`m!clan donate <amount>\``)} else {
  
ownerScore.clanFunds -= 50000
  client.setScore.run(ownerScore)
    
    let myNumber = 1
  let clanName = ''
        
  while (myNumber < args.length) {   // Execute until Infinity
  clanName += `${args[myNumber]} `
    myNumber++;
  }
    
    let bool;
        const clanNames = sql.prepare("SELECT * FROM scores ORDER BY clanName").all();
    for(const data of clanNames) {
      if(data.clanName === clanName) {
        bool=true
      }
    }
        if(bool === true) message.channel.send(v + ' Another clan already has that name!')
        if(bool === true) return;
    
    const all = sql.prepare("SELECT * FROM scores WHERE clanID=" + score.clanID).all();
    for(const data of all) {
        let dataScore = client.getScore.get(data.user)
        dataScore.clanName = clanName
      client.setScore.run(dataScore)
    }
    message.channel.send(v + ` Successfully renamed clan to \`${clanName}\``)
  }
}
}
if(args[0] === 'description' || args[0] === 'topic'){
  if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the leader of the clan to change the topic.') } else {
    
let ownerScore = client.getScore.get(clanOwner)
  
    
    let myNumber = 1
  let clanDesc = ''
        
  while (myNumber < args.length) {   // Execute until Infinity
  clanDesc += `${args[myNumber]} `
    myNumber++;
  }
    
      if(clanDesc.length > 100) message.channel.send(v + ' Your clan description can be no longer than 100 characters.')
      if(clanDesc.length > 100) return;
    
    const all = sql.prepare("SELECT * FROM scores WHERE clanID=" + score.clanID).all();
    for(const data of all) {
        let dataScore = client.getScore.get(data.user)
        dataScore.clanDesc = clanDesc
      client.setScore.run(dataScore)
    }
    message.channel.send(v + ` Successfully changed the clan description.`)
      ownerScore.clanDesc = clanDesc
      client.setScore.run(ownerScore)
  }
}
if(args[0] === 'donate') {
  if(!args[1] || isNaN(args[1]) || args[1] < 0 ||  args[1] % 1 != 0) { message.channel.send(v + ' That is not a valid value!') } else {
  if(args[1] > score.points) { message.channel.send(v + ' You do not have enough money!') } else {
    
    message.channel.send(v + 'You added $' + args[1] + ' to your clan balance!')
    score.points -= Number(args[1])
    client.setScore.run(score)
    
    const all = sql.prepare("SELECT * FROM scores WHERE clanID=" + score.clanID).all();
      for(const data of all) {
    let dataScore = client.getScore.get(data.user)
    if(data.clanRank == 1) { 
      dataScore.clanFunds += Number(args[1])
      client.setScore.run(dataScore)
    }
  }
  }
  }
}
if(args[0] === 'leave') {
  if(score.clanRank === 1) {
message.channel.send(v + ' You cannot leave a clan that you own!')} else {
  if(score.clanRank !== 1) {
    message.channel.send(v + 'You have left the clan: ' + `\`${score.clanName}\`!`)
    score.clanRank = 0
    score.clanName = 0
    score.clanID = 0
    score.clanCol = 'n'
    score.clanTier = 0
    score.clanDesc = '\u200b'
    client.setScore.run(score)
  }
}
}
if(args[0] && args[0].startsWith('color') || args[0].startsWith('colour')) {
  if(!args[1]) {
  let embed = new Discord.RichEmbed()
  embed.setDescription(`
🟥 - \`Red\` - $50k
🟧 - \`Orange\` - $50k
🟨 - \`Yellow\` - $50k
🟩 - \`Green\` - $50k
🟦 - \`Blue\` - $50k
🟪 - \`Purple\` - $50k
⬜ - \`White\` - $200k
⬛ - \`Custom Color\` - $10m
`)
  embed.addField('\u200b', `Type \`m!clan color <color>\` to buy a color.`)
  embed.setColor('#'+Math.floor(Math.random()*16777215).toString(16))
  message.channel.send(embed)
}
    if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the leader of the clan to change the color.') } else {
    
var ownerScore = client.getScore.get(clanOwner)
if(ownerScore.clanFunds < 50000) { message.channel.send(v + ` Your clan needs $50000 to change the color!
Add money to your clan balance with \`m!clan donate <amount>\``)} else {
  
ownerScore.clanFunds -= 50000
  
  client.setScore.run(ownerScore)
  
switch(args[1]) {
    case('red'):
    message.channel.send(v + ' Your clan color is now red!')
    ownerScore.clanCol = '#ff0000'
    break;
    case('orange'):
    message.channel.send(v + ' Your clan color is now orange!')
    ownerScore.clanCol = '#ffa500'
    break;
    case('yellow'):
    message.channel.send(v + ' Your clan color is now yellow!')
    ownerScore.clanCol = '#ffff00'
    break;
    case('green'):
    message.channel.send(v + ' Your clan color is now green!')
    ownerScore.clanCol = '#39ff14'
    break;
    case('blue'):
    message.channel.send(v + ' Your clan color is now blue!')
    ownerScore.clanCol = '#1b03a3'
    break;
    case('purple'):
    message.channel.send(v + ' Your clan color is now purple!')
    ownerScore.clanCol = '#bc13fe'
    break;
    case('white'):
    if(ownerScore.clanFunds < 50000) { message.channel.send(v + ` Your clan needs $200000 to change the color!
Add money to your clan balance with \`m!clan donate <amount>\``)} else {
  
    message.channel.send(v + ' Your clan color is now white!')
    ownerScore.clanCol = '#f5f1f1'
    ownerScore.clanFunds -= 150000
    }
    break;
    case('custom'):
        if(ownerScore.clanFunds < 50000) { message.channel.send(v + ` Your clan needs $10m to change the color!
Add money to your clan balance with \`m!clan donate <amount>\``)} else {
          
    function isHexColor (hex) {
     hex = hex.substr(1);
  return typeof hex === 'string'
      && hex.length === 6
      && !isNaN(Number('0x' + hex))
}
    if(isHexColor(args[2]) == false) { message.channel.send(v + ` Invalid format!
Correct format: \`m!clan color custom <hex code>\` Ex. \`m!clan color custom #ffa500\``)} else {
    message.channel.send(v + ' Your clan color is now ' + args[2])
      ownerScore.clanCol = args[2]
      ownerScore.clanFunds -= 9950000
    }
        }
    break;
}
    client.setScore.run(ownerScore)
    
}
}
}
if(args[0] === 'image'){
  if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the leader of the clan to change the image.') } else {
    
let ownerScore = client.getScore.get(clanOwner)
if(ownerScore.clanFunds < 50000) { message.channel.send(v + ` Your clan needs $50000 to set an image!
Add money to your clan balance with \`m!clan donate <amount>\``)} else {
  
ownerScore.clanFunds -= 50000
  client.setScore.run(ownerScore)
    
  
function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
   var extension = str.substr(str.length - 3); // get last 3 chars from the string
 if ((extension == "jpg") || (extension == "png") || (extension === 'jpeg')) {
  return pattern.test(str);
} 
}
  if(isURL(args[1]) === true) {
    let embed = new Discord.RichEmbed()
    .setDescription('Successfully changed clan image.')
    .setThumbnail(args[1])
    .setColor(ownerScore.clanCol)
    message.channel.send(embed)
    ownerScore.clanImg = args[1]
    client.setScore.run(ownerScore)
  } else {
    message.channel.send(v + ' Invalid link. Must be an image link.')
  }
  }
}
}
if(args[0] === 'promote') {
    if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the owner of the clan to promote someone.') } else {
      user = message.mentions.users.first()
      if(!user) { message.channel.send(v + ' You have to mention someone!') } else {
        let pScore = client.getScore.get(user.id)
        if(pScore.clanID !== score.clanID) { message.channel.send(v + ' This user is not in your clan.') } else {
        if(pScore.clanRank === 3) { message.channel.send(v + ' This user is already a moderator!') } else {
      message.channel.send(`${v} ${user} has been promoted to moderator.`)
        pScore.clanRank = 3
client.setScore.run(pScore)
        }
        }
      }
    }
}
if(args[0] === 'demote') {
    if(score.clanRank !== 1) {
    message.channel.send(v + ' You must be the owner of the clan to demote someone.') } else {
      user = message.mentions.users.first()
      if(!user) { message.channel.send(v + ' You have to mention someone!') } else {
        let pScore = client.getScore.get(user.id)
        if(pScore.clanID !== score.clanID) { message.channel.send(v + ' This user is not in your clan.') } else {
        if(pScore.clanRank === 2) { message.channel.send(v + ' This user is not a moderator!') } else {
      message.channel.send(`${v} ${user} has been demoted.`)
        pScore.clanRank = 2
client.setScore.run(pScore)
        }
        }
      }
    }
}
if(args[0] === 'kick') {
    if(score.clanRank !== 3 && score.clanRank !== 1) {
    message.channel.send(v + ' You must be a clan moderator to kick someone.') } else {
      user = message.mentions.users.first()
      if(!user) { message.channel.send(v + ' You have to mention someone!') } else {
        let pScore = client.getScore.get(user.id)
        if(pScore.clanID !== score.clanID) { message.channel.send(v + ' This user is not in your clan.') } else {
        if(pScore.clanRank === 3 || pScore.clanRank === 1) { message.channel.send(v + ' You cannot kick a clan moderator!') } else {
      message.channel.send(`${v} ${user} has been kicked.`)
        pScore.clanID = 0;
        pScore.clanRank = 0;
client.setScore.run(pScore)
        }
        }
      }
    }
}
if(args[0].startsWith('upgrade')) {
  
  if(cScore.clanTier == null) cScore.clanTier = 0
  if(!args[1]) {
  let embed = new Discord.RichEmbed()
  .setAuthor('Clan Upgrades')
  .addField('Type `m!clan upgrade <id>` to buy an upgrade.', `
[1] +5 Member Limit | $${monize(((cScore.clanMemCount - 20) / 5) * 250000 + 250000)} (Current: ${cScore.clanMemCount})
[2] Increase Clan Tier | $${monize(500000 * (Math.pow(10, cScore.clanTier)/5))} (Current Tier: ${cScore.clanTier})
`)
  .setFooter(`Tier ${cScore.clanTier +1} gives the clan +3% XP, +3% Ores, +3% Emeralds`)
  .setColor(cScore.clanCol)
  message.channel.send(embed)
  }
  if(args[1] == '1') {
    if(score.clanRank != '1') { message.channel.send(v + ' You have to be the clan leader to buy this upgrade!') } else {
    if(cScore.clanFunds < (((cScore.clanMemCount - 20) / 5) * 250000 + 250000)) { message.channel.send(v + ` You need $${monize(((cScore.clanMemCount - 20) / 5) * 250000 + 250000)} to purchase that upgrade!
Add money to your clan balance with \`m!clan donate <amount>\``) } else {
      message.channel.send(v + ` Successfully bought \`+5 Member Limit\``)
      cScore.clanFunds -= (((cScore.clanMemCount - 20) / 5) * 250000 + 250000)
      cScore.clanMemCount += 5
      client.setScore.run(cScore)
    }
    }
  }
  if(args[1] == '2') {
    if(score.clanRank != '1') { message.channel.send(v + ' You have to be the clan leader to buy this upgrade!') } else {
    if(cScore.clanFunds < (500000 * (Math.pow(10, cScore.clanTier)/5))) { message.channel.send(v + ` You need $${monize(500000 * (Math.pow(10, cScore.clanTier)/5))} to purchase that upgrade!
Add money to your clan balance with \`m!clan donate <amount>\``) } else {
      message.channel.send(v + ` Successfully bought \`Tier ${cScore.clanTier + 1}\``)
      cScore.clanFunds -= (500000 * (Math.pow(10, cScore.clanTier)/5))
      cScore.clanTier++;
      client.setScore.run(cScore)
    }
    }
  }
}
  }
};