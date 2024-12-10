import puzzleData from '../data/puzzle1.json';

const colors = [
    "#FFFFFF", // White
    "#000000", // black
    "#EB5757", // red
    "#F2994A", // orange
    "#F2C94C", // yellow
    "#27AE60", // green
    "#2F80ED", // blue
    "#9B51E0", // indigo
    "#4B0082", // violet
    "#964B00", // brown
];

export class Service {
    getPuzzleData(puzzleId: string) {
      if (puzzleId === 'puzzle1') {
        return puzzleData; // puzzleData already stores pixels as indices
      }
      return null;
    }
  
    // Convert a hex-based user solution into index-based solution
    convertSolutionHexToIndices(hexSolution: string[][]): number[][] {
      return hexSolution.map(row =>
        row.map(hexColor => {
          const index = colors.indexOf(hexColor);
          return index !== -1 ? index : 0; // default to 0 if not found, or handle error
        })
      );
    }
  
    validateSolution(userSolution: number[][], puzzleId: string): boolean {
      const puzzle = this.getPuzzleData(puzzleId);
      if (!puzzle) return false;
  
      // puzzle.pixels is already in the correct index form
      // Just compare arrays directly
      return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
    }
  }