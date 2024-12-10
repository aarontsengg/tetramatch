import allPuzzles from '../data/puzzles.json';

export class Service {
  getPuzzleData(puzzleId: string) {
    // allPuzzles is an object with a "puzzles" array
    // Find the puzzle with the matching puzzleId
    const puzzle = allPuzzles.puzzles.find(p => p.puzzleId === puzzleId);
    return puzzle || null;
  }

  validateSolution(userSolution: number[][], puzzleId: string): boolean {
    const puzzle = this.getPuzzleData(puzzleId);
    if (!puzzle) return false;

    return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
  }
}
