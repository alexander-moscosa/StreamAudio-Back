"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
class Server {
    constructor(_port, _mongoose_uri) {
        this._port = _port;
        this._mongoose_uri = _mongoose_uri;
        this._app = (0, express_1.default)();
        this._server = http_1.default.createServer(this._app);
        this._io = new socket_io_1.default.Server(this._server);
        this._apiPaths = {
            user: '/api/v1/user',
            points: '/api/v1/points'
        };
    }
    setCors() {
        this._app.use((0, cors_1.default)({
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST']
        }));
    }
    parseBody() {
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this._app.use(this._apiPaths.user, user_routes_1.default);
    }
    connectDB() {
        mongoose_1.default.connect(this._mongoose_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`\n[*] Database Connected`);
        });
    }
    runServer() {
        this._server.listen(this._port, () => {
            console.log(`\n[*] Server Listening on Port ${this._port}`);
        });
    }
}
exports.default = Server;
