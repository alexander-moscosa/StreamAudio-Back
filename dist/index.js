"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Server_1 = __importDefault(require("./models/Server"));
dotenv_1.default.config();
const server = new Server_1.default(process.env.PORT || '', process.env.MONGO_URI || '');
server.setCors();
server.parseBody();
server.routes();
server.connectDB();
server.runServer();
