"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const valid_roles = {
    values: [process.env.USER_ROLE, process.env.ADMIN_ROLE],
    message: '{VALUE} is not a valid role'
};
const schema = new mongoose_1.Schema({
    username: { type: String, required: [true, 'Username is required!'], unique: true },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    twitch_id: { type: Number, required: [true, 'Twitch ID is required'], unique: true },
    role: { type: String, required: [true, 'Role requried'], default: process.env.USER_ROLE, enum: valid_roles },
    whoseIsMod: { type: [mongoose_1.Schema.Types.ObjectId] },
    desactived: { type: Boolean, required: [true, 'Desactived is required'], default: false }
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
};
exports.userSchema = (0, mongoose_1.model)('User', schema);
