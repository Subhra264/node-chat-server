import mongoose, { Document, Model, Schema as SchemaType } from 'mongoose';
import { comparePassword } from '../utils/encryption_utils/bcrypt_utils';
const Schema = mongoose.Schema;

export interface UserSchema {
    name?: string;
    username: string;
    email: string;
    password: string;
    profilePic?: string;
    about: string;
}

export interface UserDocument extends UserSchema, Document {
    validatePassword: (password: string) => Promise<boolean>;
    refreshToken?: string;
    groups: [ SchemaType.Types.ObjectId ];
    friends: [ SchemaType.Types.ObjectId ];
    sentFriendRequests: [ SchemaType.Types.ObjectId ];
    receivedFriendRequests: [ SchemaType.Types.ObjectId ];
}

const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        minLength: 3,
        maxLength:40,
        trim: true
    },

    username: {
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
        minlength: 6
    },

    profilePic: {
        type: String
    },

    about: {
        type: String,
        default: 'Hey there! I am using node-chat 😜🤪🤪'
    },

    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Group"
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
            type: Schema.Types.ObjectId,
            ref : "User"
        }
    ],

    receivedFriendRequests: [
        {
            type: Schema.Types.ObjectId,
            ref : "User"
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

UserSchema.post('save', (doc) => {
    console.log('UserSchema post save function called along with this doc', doc);

});

// interface UserModel extends Model<User> {
//     validatePassword(password: string): Promise<boolean>
// }

export default mongoose.model("User", UserSchema);