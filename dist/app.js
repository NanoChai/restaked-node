"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const ethereumService_1 = require("./services/ethereumService");
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors({
    origin: [
        'https://website-base-kappa.vercel.app',
        'http://localhost:3000',
        '*'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
app.set('trust proxy', true);
app.post('/sign-spend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, amount, chainId, serviceAddress, userSig, timestamp } = req.body;
        const data = yield (0, ethereumService_1.verifyAndSign)(userAddress, amount, chainId, serviceAddress, userSig, timestamp);
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
app.post('/deposit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, amount, chainId } = req.body;
        const data = yield (0, ethereumService_1.recordDeposit)(userAddress, amount, chainId);
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
const PORT = Number(process.env.PORT) || 3001;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.sync();
            console.log('Database synced');
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server is running on port ${PORT}`);
            }).on('error', (err) => {
                if (err.code === 'EACCES') {
                    console.error('Error: Requires elevated privileges. Try using sudo or port redirection.');
                }
                else {
                    console.error('Server error:', err);
                }
            });
        }
        catch (error) {
            console.error('Error starting server:', error);
        }
    });
}
startServer();
