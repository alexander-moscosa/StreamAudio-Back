"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.getUserByUsername = void 0;
const user_1 = require("../schemas/user");
const File_1 = __importDefault(require("../models/File"));
const path_1 = __importDefault(require("path"));
const getUserByUsername = (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(404).json({
            ok: false,
            err: {
                message: "User not found",
            },
        });
    }
    user_1.userSchema.findOne({ username }, (err, user) => {
        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User not found",
                },
            });
        }
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        return res.json({
            ok: true,
            user,
        });
    });
};
exports.getUserByUsername = getUserByUsername;
const register = (req, res) => {
    const body = req.body;
    if (!body.username || !body.email || !body.twitch_id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Fill the fields correctly'
            }
        });
    }
    const newUser = new user_1.userSchema({
        username: body.username,
        email: body.email,
        twitch_id: body.twitch_id,
    });
    newUser.save((err, user) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        const user_log = File_1.default.readFile(path_1.default.resolve(__dirname, '../../database/users.log.json'));
        const user_log_object = JSON.parse(user_log);
        user_log_object.users.push({
            username: user.username,
            email: user.email,
            ip: req.socket.remoteAddress,
            twitch_id: user.twitch_id,
            action: 'register'
        });
        File_1.default.writeFile(path_1.default.resolve(__dirname, '../../database/users.log.json'), user_log_object);
        return res.json({
            ok: true,
            user,
        });
    });
};
exports.register = register;
const login = (req, res) => {
    const body = req.body;
    if (!body.username || !body.email || !body.twitch_id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Fill the fields correctly'
            }
        });
    }
    user_1.userSchema.findOne({ username: body.username, email: body.email, twitch_id: body.twitch_id }, (err, user) => {
        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        const user_log = File_1.default.readFile(path_1.default.resolve(__dirname, '../../database/users.log.json'));
        const user_log_object = JSON.parse(user_log);
        user_log_object.users.push({
            username: user.username,
            email: user.email,
            ip: req.socket.remoteAddress,
            twitch_id: user.twitch_id,
            date: new Date().getTime(),
            action: 'login'
        });
        File_1.default.writeFile(path_1.default.resolve(__dirname, '../../database/users.log.json'), user_log_object);
        return res.json({
            ok: true,
            user
        });
    });
};
exports.login = login;
