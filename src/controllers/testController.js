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
const express_1 = require("express");
const Service_1 = __importDefault(require("../services/Service"));
const router = (0, express_1.Router)();
const service = new Service_1.default();
router.get('/test-redis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield service['redisClient'].set('test-key', 'Redis is working!');
        const value = yield service['redisClient'].get('test-key');
        res.json({ message: value });
    }
    catch (error) {
        console.error('Redis test failed:', error);
        res.status(500).json({ message: 'Redis connection failed.' });
    }
}));
exports.default = router;
//# sourceMappingURL=testController.js.map