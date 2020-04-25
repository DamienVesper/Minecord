const dotenv = require(`dotenv`).config();

const { client } = require(`./index.js`);
const DBL = require(`dblapi.js`);
const dbl = new DBL(process.env.DBL_TOKEN, {
        webhookPort: 5000,
        webhookAuth: process.env.WEBHOOK_AUTH
    }, client);