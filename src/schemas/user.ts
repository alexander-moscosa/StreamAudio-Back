import { Schema, model } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const valid_roles = {
  values: [process.env.USER_ROLE, process.env.ADMIN_ROLE],
  message: '{VALUE} is not a valid role'
}

const schema = new Schema({
    username: { type: String, required: [true, 'Username is required!'], unique: true },
    email: { type: String, required: [ true, 'Email is required' ], unique: true },
    twitch_id: { type: Number, required: [ true, 'Twitch ID is required' ], unique: true },
    role: { type: String, required: [ true, 'Role requried' ], default: process.env.USER_ROLE, enum: valid_roles },
    whoseIsMod: { type: [Schema.Types.ObjectId] },
    desactived: { type: Boolean, required: [ true, 'Desactived is required' ], default: false }
}); 

schema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    delete userObject.username;
    delete userObject.email;
    delete userObject.twitch_id;
    delete userObject.role;
    delete userObject.whoseIsMod;
    delete userObject.desactived;

    return userObject;
}

export const userSchema = model('User', schema);