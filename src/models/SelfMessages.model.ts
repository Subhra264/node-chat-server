import mongoose, { Document, Schema as SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

export interface SelfMessage {
    message: string;
    date: Date;
}

export interface SelfMessagesSchema {
    user: SchemaType.Types.ObjectId;
    messages: [ SelfMessage ];
}

export interface SelfMessagesDocument extends SelfMessagesSchema, Document {}

const SelfMessagesSchema = new Schema<SelfMessagesDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    messages: [
        {
            message: String,
            date: Date
        }
    ]
});

export default mongoose.model('SelfMessages', SelfMessagesSchema);