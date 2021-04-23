require(`dotenv`).config();

const pjson = require(`../../package.json`);

const config = {
    colors: {
        success: 0x00ff00,
        primary: 0x1e90ff,
        warning: 0xffa500,
        danger: 0xff0000
    },

    developerIDs: [`386940319666667521`],

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

    footer: `Created by DamienVesper#0001 | ${pjson.version}`
};

module.exports = config;
