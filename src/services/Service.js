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
class Service {
    constructor() {
        this.redisClient = (0, redis_1.createClient)({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
            password: process.env.REDIS_PASSWORD || undefined,
        });
        this.redisClient.on('error', (err) => console.error('Redis Client Error', err));
        this.redisClient.connect().then(() => {
            console.log('Connected to Redis');
        }).catch(err => {
            console.error('Failed to connect to Redis:', err);
        });
    }
    getPuzzle(puzzleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const puzzleData = yield this.redisClient.get(`puzzle:${puzzleId}`);
                if (puzzleData) {
                    return JSON.parse(puzzleData);
                }
                return null;
            }
            catch (error) {
                console.error(`Error fetching puzzle ${puzzleId}:`, error);
                return null;
            }
        });
    }
    savePuzzle(puzzle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redisClient.set(`puzzle:${puzzle.puzzleId}`, JSON.stringify(puzzle));
                return true;
            }
            catch (error) {
                console.error(`Error saving puzzle ${puzzle.puzzleId}:`, error);
                return false;
            }
        });
    }
    validateSolution(puzzleId, userSolution) {
        return __awaiter(this, void 0, void 0, function* () {
            const puzzle = yield this.getPuzzle(puzzleId);
            if (!puzzle) {
                console.warn(`Puzzle ${puzzleId} not found for validation.`);
                return false;
            }
            return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
        });
    }
    addNewPuzzle(newPuzzle) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPuzzle = yield this.getPuzzle(newPuzzle.puzzleId);
            if (existingPuzzle) {
                console.warn(`Puzzle ${newPuzzle.puzzleId} already exists.`);
                return false;
            }
            return yield this.savePuzzle(newPuzzle);
        });
    }
}
exports.default = Service;
//# sourceMappingURL=Service.js.map