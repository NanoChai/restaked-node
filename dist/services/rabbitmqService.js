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
exports.connectRabbitMQ = connectRabbitMQ;
exports.scheduleClaimFunds = scheduleClaimFunds;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let channel;
function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const connection = await amqp.connect(process.env.RABBITMQ_URL!);
            const connection = yield amqplib_1.default.connect({
                protocol: 'amqp',
                hostname: '127.0.0.1', // Use IPv4 address explicitly
                port: 5672,
                username: 'nano',
                password: 'manjuMola',
            });
            channel = yield connection.createChannel();
            yield channel.assertQueue('claimFunds');
            channel.consume('claimFunds', (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg !== null) {
                    console.log('Received update wallets message');
                    channel.ack(msg);
                }
            }));
            console.log('Connected to RabbitMQ');
        }
        catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    });
}
function scheduleClaimFunds() {
    return __awaiter(this, void 0, void 0, function* () {
        if (channel) {
            yield channel.sendToQueue('claimFunds', Buffer.from('update'));
            console.log('Wallet update scheduled');
        }
    });
}
