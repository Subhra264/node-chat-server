import mongoose, { Document, Schema as SchemaType } from "mongoose";
const Schema = mongoose.Schema;

export interface GroupSchema {
    name: string;
    image?: string;
    description?: string;
}

export interface GroupDocument extends GroupSchema, Document {
    createdAt: Date;
    admins: [ SchemaType.Types.ObjectId ];
    users: [ SchemaType.Types.ObjectId ];
    defaultChannel: SchemaType.Types.ObjectId;
    textChannels: [{
        name: string;
        reference: SchemaType.Types.ObjectId;
    }];
    voiceChannels: [{
        name: string;
        reference: SchemaType.Types.ObjectId;
    }];
}

const GroupSchema = new Schema<GroupDocument>({
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

    defaultChannel: {
        type: Schema.Types.ObjectId,
        ref: 'TextChannel'
    },

    // Denormalize textChannel name property as it is not supposed to change
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

export default mongoose.model('Group', GroupSchema);