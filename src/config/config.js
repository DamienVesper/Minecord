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
    footer: `Created by DamienVesper#0001 | ${pjson.version}`
};

module.exports = config;
