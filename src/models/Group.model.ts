const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 3
    },

    image: {
        type: String
    },

    description: {
        type: String  
    },

    users: [
        {
            name: String,
            reference: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],

    textChannels: [
        {
            name: String,
            reference: {
                type: Schema.Types.ObjectId,
                ref: 'TextChannel'
            }
        }
    ],

    voiceChannels: [
        {
            name: String,
            reference: {
                type: Schema.Types.ObjectId,
                ref: 'VoiceChannel'
            }
        }
    ]
});

export = mongoose.model('Group', GroupSchema);