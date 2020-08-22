const DiscordBot = require(`./src/index.js`);
// const config = require(`./src/config/config`);

// const mongoDB = require(`mongodb`);
// const mongoose = require(`mongoose`);

// mongoDB.connect(config.db.uri, config.db.uriParams).then(() => console.log(`Succesfully connected to MongoDB Atlas.`)).catch(err => console.error(err));
// mongoose.connect(config.db.uri, config.db.uriParams).then(() => console.log(`Succesfully connected Mongoose to MongoDB.`)).catch(err => console.error(err));

// const User = require(`./src/models/user.model`);

// let users = await User.find({});
// users.forEach(user => {
//     user.ores.netherite = 0;

//     user.weapons.swords.netherite = false;
//     user.weapons.pickaxes.netherite = false;
//     user.weapons.axes.netherite = false;

//     user.drops.shulkerShells = 0;

//     user.save(err => console.log(`[${user.discordID}] ${err ? `Error saving user data.`: `User data saved succesfully.`}`));
// });
