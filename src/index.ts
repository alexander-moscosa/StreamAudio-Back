import dotenv from 'dotenv';
import Server from './models/Server';
dotenv.config();

const server: Server = new Server( process.env.PORT || '', process.env.MONGO_URI || '' );

server.setCors();
server.parseBody();
server.routes();
server.connectDB();
server.runServer();