import {Schema} from 'mongoose';
import {emailRegex, transform} from './utils';

const userStatuses = ['ACTIVE', 'INACTIVE'];
const userTypes = ['ADMIN', 'USER'];

const userDefinition = {
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        match: emailRegex
    },

    password: {
        type: String
    },

    status: {
        type: String,
        required: true,
        enum: userStatuses,
        default: 'ACTIVE'
    },

    type: {
        type: String,
        required: true,
        enum: userTypes
    },

    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },

    facebook: {
        userId: String,
        accessToken: String
    },

    google: {
        userId: String,
        accessToken: String
    }
};

const userSchema = new Schema(userDefinition);

if(!userSchema.options.toObject)
    userSchema.options.toObject = {};

userSchema.options.toObject.transform = transform;

export {userSchema, userStatuses, userTypes};