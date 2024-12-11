// src/seedPuzzles.ts

import fs from 'fs';
import path from 'path';

interface Puzzle {
  puzzleId: string;
  width: number;
  height: number;
  pixels: number[][];
}

const puzzlesFilePath = path.join(__dirname, './data/puzzles.json');

const seedPuzzles = (): void => {
  const puzzles: Puzzle[] = [
    {
      puzzleId: "puzzle1",
      width: 8,
      height: 8,
      pixels: [
        [0,0,0,0,0,9,0,0],
        [0,5,5,0,9,9,0,0],
        [0,0,5,5,9,2,2,0],
        [0,2,2,2,2,2,2,2],
        [0,2,2,2,2,2,2,2],
        [0,2,2,2,2,2,2,2],
        [0,2,2,2,2,2,2,2],
        [0,0,2,2,2,2,2,0]
      ]
    },
    {
      puzzleId: "puzzle2",
      width: 8,
      height: 8,
      pixels: [
        [0,1,1,1,1,1,1,0],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [0,1,1,1,1,1,1,0]
      ]
    }
    // Add more puzzles as needed
  ];

  const data = { puzzles };

  fs.writeFileSync(puzzlesFilePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Puzzles have been seeded to puzzles.json');
};

seedPuzzles();
