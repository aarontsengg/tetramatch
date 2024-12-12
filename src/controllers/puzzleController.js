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
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const puzzleId = parseInt(req.params.id);
    try {
        const puzzle = yield service.getPuzzle(puzzleId);
        if (puzzle) {
            res.json(puzzle);
        }
        else {
            res.status(404).json({ message: 'Puzzle not found.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { puzzleId, userId, createdAt, width, height, pixels } = req.body;
    if (!puzzleId || !width || !height || !pixels) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const newPuzzle = { puzzleId, userId, createdAt, width, height, pixels };
    try {
        const success = yield service.addNewPuzzle(newPuzzle);
        if (success) {
            res.status(201).json({ message: 'Puzzle added successfully.' });
        }
        else {
            res.status(400).json({ message: 'Puzzle ID already exists.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
router.post('/:id/validate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const puzzleId = parseInt(req.params.id);
    const { userSolution } = req.body;
    if (!userSolution || !Array.isArray(userSolution)) {
        return res.status(400).json({ message: 'Invalid user solution.' });
    }
    try {
        const isValid = yield service.validateSolution(puzzleId, userSolution);
        res.json({ isValid });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
exports.default = router;
//# sourceMappingURL=puzzleController.js.map