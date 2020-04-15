const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
    banned: {
        type: Boolean,
        required: true
    },
    clan: {
        type: Number,
        required: false
    },
    cooldowns: {
        chop: {
            type: String,
            required: true
        },
        fight: {
            type: String,
            required: true
        },
        mine: {
            type: String,
            required: true
        }
    },
    discordID: {
        type: String,
        required: true
    },
    equipped: {
        sword: {
            type: Number,
            required: true
        },
        pickaxe: {
            type: Number,
            required: true
        },
        axe: {
            type: Number,
            required: true
        }
    },
    money: {
        type: Number,
        required: true
    },
    ores: {
        stone: {
            type: Number,
            required: true
        },
        coal: {
            type: Number,
            required: true
        },
        iron: {
            type: Number,
            required: true
        },
        gold: {
            type: Number,
            required: true
        },
        diamond: {
            type: Number,
            required: true
        },
        lapis: {
            type: Number,
            required: true
        },
        redstone: {
            type: Number,
            required: true
        },
        emerald: {
            type: Number,
            required: true
        }
    },
    plants: {
        beetroot: {
            type: Number,
            required: true
        },
        carrots: {
            type: Number,
            required: true
        },
        melons: {
            type: Number,
            required: true
        },
        pumpkins: {
            type: Number,
            required: true
        },
        potatoes: {
            type: Number,
            required: true
        },
        wheat: {
            type: Number,
            required: true
        }
    },
    seeds: {
        wheat: {
            type: Number,
            required: true
        },
        pumpkin: {
            type: Number,
            required: true
        },
        melon: {
            type: Number,
            required: true
        },
        beetroot: {
            type: Number,
            required: true
        }
    },
    stats: {
        totalMines: {
            type: Number,
            required: true
        },
        totalChops: {
            type: Number,
            required: true
        },
        totalFights: {
            type: Number,
            required: true
        },
    },
    weapons: {
        swords: {
            wood: {
                type: Boolean,
                required: true
            },
            stone: {
                type: Boolean,
                required: true
            },
            iron: {
                type: Boolean,
                required: true
            },
            gold: {
                type: Boolean,
                required: true
            },
            diamond: {
                type: Boolean,
                required: true
            }
        },
        pickaxes: {
            wood: {
                type: Boolean,
                required: true
            },
            stone: {
                type: Boolean,
                required: true
            },
            iron: {
                type: Boolean,
                required: true
            },
            gold: {
                type: Boolean,
                required: true
            },
            diamond: {
                type: Boolean,
                required: true
            }
        },
        axes: {
            wood: {
                type: Boolean,
                required: true
            },
            stone: {
                type: Boolean,
                required: true
            },
            iron: {
                type: Boolean,
                required: true
            },
            gold: {
                type: Boolean,
                required: true
            },
            diamond: {
                type: Boolean,
                required: true
            }
        }
    },
    wood: {
        oak: {
            type: Number,
            required: true
        },
        birch: {
            type: Number,
            required: true
        },
        spruce: {
            type: Number,
            required: true
        },
        acacia: {
            type: Number,
            required: true
        },
        jungle: {
            type: Number,
            required: true
        },
    },
    xp: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model(`User`, userSchema);