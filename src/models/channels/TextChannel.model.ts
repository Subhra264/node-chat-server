import mongoose, { Document, Schema as SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

export interface Message {
    message: string;
    sender: {
        username: string;
        reference: SchemaType.Types.ObjectId;
    };
}

export interface TextChannelSchema {
    name: string;
    parentGroup: SchemaType.Types.ObjectId;
    description?: string;
}

export interface TextChannelDocument extends TextChannelSchema, Document {
    messages: [ Message ];
}

const TextChannelSchema = new Schema<TextChannelDocument>({
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

    description: {
        type: String
    },

    messages: [
        {
            message: String,
            sender: {
                // Denormalize username as it is not supposed to be changed
                username: String,
                reference: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        }
    ]
});

export default mongoose.model('TextChannel', TextChannelSchema);