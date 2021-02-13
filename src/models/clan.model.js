const mongoose = require(`mongoose`);

const clanSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    members: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model(`Clan`, clanSchema);
