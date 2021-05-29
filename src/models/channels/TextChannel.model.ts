const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextChannelSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },

    parentGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    textMessages: [
        {
            message: {
                type: String || Buffer
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});

export = mongoose.model('TextChannel', TextChannelSchema);