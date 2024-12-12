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
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
});
client.on('error', (err) => console.error('Redis Client Error', err));
const testRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Connected to Redis');
        yield client.set('test-key', 'Redis is working!');
        const value = yield client.get('test-key');
        console.log('Value of test-key:', value);
        yield client.del('test-key');
        console.log('Deleted test-key');
        yield client.disconnect();
        console.log('Disconnected from Redis');
    }
    catch (error) {
        console.error('Error testing Redis:', error);
    }
});
testRedis();
//# sourceMappingURL=testRedis.js.map