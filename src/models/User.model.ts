import mongoose, { Document } from 'mongoose';
import { comparePassword } from '../utils/encryption_utils/bcrypt_utils';
const Schema = mongoose.Schema;

interface User extends Document {
    name: string;
    userName: string;
    email: string;
    password: string;
    image?: string;
    about: string;
}

const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength: 12,
        minlength: 3
    },

    email: {
        required: true,
        lowercase: true,
        trim: true,
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20
    },

    image: {
        type: String
    },

    about: {
        type: String,
        default: 'Hey there! I am using node-chat 😜🤪🤪'
    },

    groups: [
        {
            name: String,
            reference :  {
                type: Schema.Types.ObjectId,
                ref: "Group"
            } 
        }
    ],

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref : "User"
        }
    ],

    sentFriendRequests: [
        {
            name: String,
            reference :  {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    receivedFriendRequests: [
        {
            name: String,
            reference :  {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    refreshToken: {
        type: String
    }
});

UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    try {
        return await comparePassword(password, this.password);
    } catch(err) {
        throw err;
    }
}

export = mongoose.model("User", UserSchema);