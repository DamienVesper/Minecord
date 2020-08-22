const dotenv = require(`dotenv`).config();

var config = {
    colors: {
        success: 0x00ff00,
        primary: 0x1e90ff,
        warning: 0xffa500,
        danger: 0xff0000
    },
    developer: `DamienVesper`,
	developerTag: `2257`,
    developerIDs: [`386940319666667521`, `125016735660113920`],
    hostname: `gateway.discord.gg`,
	prefix: `m!`,
    token: process.env.DISCORD_BOT_TOKEN,
    db: {
        uri: process.env.DATABASE_URI,
        uriParams: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        password: process.env.DATABASE_PASSWORD
    },
    version: `4.0.0`,
    footer: `© Minecord 2020`
}

config.footer += ` | v${config.version}`;
module.exports = config;