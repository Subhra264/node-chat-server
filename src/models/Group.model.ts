import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

interface Group extends Document{
    name: string;
    image?: string;
    description?: string;
}

const GroupSchema = new Schema<Group>({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 3
    },

    image: {
        type: String,
        // required: true
    },

    description: {
        type: String  
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    textChannels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TextChannel'
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