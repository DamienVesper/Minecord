const dotenv = require(`dotenv`).config();

const { ShardingManager } = require(`discord.js`);
const shardManager = new ShardingManager(`./src/index.js`, { token: process.env.DISCORD_BOT_TOKEN });

shardManager.spawn(6);
shardManager.on(`launch`, shard => console.log(`Launched Shard: ${shard.id}.`));