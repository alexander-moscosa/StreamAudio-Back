import express from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import socket from 'socket.io';
import http from 'http';
import { ApiPaths } from '../interfaces/interfaces';
import userRouter from '../routes/user.routes';

class Server {

  private _port: string;
  private _mongoose_uri: string;
  private _app: express.Application;
  private _server: http.Server;
  private _io;
  private _apiPaths: ApiPaths;

  constructor( _port: string, _mongoose_uri: string ) {
    this._port = _port;
    this._mongoose_uri = _mongoose_uri;
    this._app = express();
    this._server = http.createServer(this._app);
    this._io = new socket.Server(this._server);
    this._apiPaths = {
      user: '/api/v1/user',
      points: '/api/v1/points'
    }
  }

  public setCors(): void {
    this._app.use( cors({
      origin: '*', // Change ASAP
      credentials: true,
      methods: ['GET', 'POST']
    }));
  }

  public parseBody(): void {
    this._app.use(express.json());
    this._app.use(express.urlencoded({extended: false}));
  }

  public routes(): void {
    this._app.use( this._apiPaths.user, userRouter );
  }

  public connectDB(): void {
    mongoose.connect( this._mongoose_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions, ( err: mongoose.CallbackError ) => {
      if ( err ) {
        console.log(err);
        return;
      }
      console.log(`\n[*] Database Connected`);
    });
  }

  public runServer(): void {
    this._server.listen( this._port, () => {
      console.log(`\n[*] Server Listening on Port ${ this._port }`);
    });
  }

}

export default Server;