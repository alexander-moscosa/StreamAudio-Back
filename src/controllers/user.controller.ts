import { Request, Response } from "express";
import { userSchema } from "../schemas/user";
import mongoose from "mongoose";
import File from "../models/File";
import path from 'path';

export const getUserByUsername = (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    return res.status(404).json({
      ok: false,
      err: {
        message: "User not found",
      },
    });
  }

  userSchema.findOne({ username }, (err: mongoose.CallbackError, user: any) => {
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

export const register = (req: Request, res: Response) => {
  const body = req.body;

  if ( !body.username || !body.email || !body.twitch_id ) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Fill the fields correctly'
      }
    })
  }

  const newUser = new userSchema({
    username: body.username,
    email: body.email,
    twitch_id: body.twitch_id,
  });

  newUser.save((err: mongoose.CallbackError, user: any) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    const user_log = File.readFile(path.resolve(__dirname, '../../database/users.log.json'));
    const user_log_object = JSON.parse(user_log);

    user_log_object.users.push({
      username: user.username,
      email: user.email,
      ip: req.socket.remoteAddress,
      twitch_id: user.twitch_id,
      action: 'register'
    });

    File.writeFile(path.resolve(__dirname, '../../database/users.log.json'), user_log_object);

    return res.json({
      ok: true,
      user,
    });
  });
};

export const login = ( req: Request, res: Response ) => {
  const body = req.body;

  if ( !body.username || !body.email || !body.twitch_id ) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Fill the fields correctly'
      }
    });
  }

  userSchema.findOne({ username: body.username, email: body.email, twitch_id: body.twitch_id }, ( err: mongoose.CallbackError, user: any ) => {
    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User not found'
        }
      });
    }

    if ( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    const user_log = File.readFile(path.resolve(__dirname, '../../database/users.log.json'));
    const user_log_object = JSON.parse(user_log);

    user_log_object.users.push({
      username: user.username,
      email: user.email,
      ip: req.socket.remoteAddress,
      twitch_id: user.twitch_id,
      date: new Date().getTime(),
      action: 'login'
    });

    File.writeFile(path.resolve(__dirname, '../../database/users.log.json'), user_log_object);

    return res.json({
      ok: true,
      user
    });
  });
}
