"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const puzzleController_1 = __importDefault(require("./controllers/puzzleController"));
const testController_1 = __importDefault(require("./controllers/testController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT_BACKEND || 4000;
app.use((0, cors_1.default)({
    origin: `http://localhost:${process.env.PORT_FRONTEND || 3000}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.json());
app.use('/api/puzzles', puzzleController_1.default);
app.use('/api', testController_1.default);
app.get('/health', (req, res) => {
    res.status(200).send('Backend is healthy');
});
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map