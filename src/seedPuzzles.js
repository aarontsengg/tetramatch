"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puzzlesFilePath = path_1.default.join(__dirname, './data/puzzles.json');
const seedPuzzles = () => {
    const puzzles = [
        {
            puzzleId: "puzzle1",
            width: 8,
            height: 8,
            pixels: [
                [0, 0, 0, 0, 0, 9, 0, 0],
                [0, 5, 5, 0, 9, 9, 0, 0],
                [0, 0, 5, 5, 9, 2, 2, 0],
                [0, 2, 2, 2, 2, 2, 2, 2],
                [0, 2, 2, 2, 2, 2, 2, 2],
                [0, 2, 2, 2, 2, 2, 2, 2],
                [0, 2, 2, 2, 2, 2, 2, 2],
                [0, 0, 2, 2, 2, 2, 2, 0]
            ]
        },
        {
            puzzleId: "puzzle2",
            width: 8,
            height: 8,
            pixels: [
                [0, 1, 1, 1, 1, 1, 1, 0],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [0, 1, 1, 1, 1, 1, 1, 0]
            ]
        }
    ];
    const data = { puzzles };
    fs_1.default.writeFileSync(puzzlesFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Puzzles have been seeded to puzzles.json');
};
seedPuzzles();
//# sourceMappingURL=seedPuzzles.js.map