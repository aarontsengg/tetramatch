import { Puzzle } from '../models/puzzle'; // Assuming puzzle model is in puzzle.ts

export class Service {
  async getPuzzleData(puzzleId: string) {
    // Find puzzle in MongoDB by puzzleId
    const puzzle = await Puzzle.findOne({ puzzleId }).lean();
    return puzzle || null;
  }

  async validateSolution(userSolution: number[][], puzzleId: string): Promise<boolean> {
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Validates the user's solution against the correct puzzle solution.
   * 
   * @param userSolution - A 2D array representing the user's solution.
   * @param puzzleId - The ID of the puzzle to validate against.
   * @returns `true` if the user's solution matches the puzzle's solution; otherwise, `false`.
   */
/******  cbf5d31c-b842-436c-ab73-82ea46217742  *******/    const puzzle = await this.getPuzzleData(puzzleId);
    if (!puzzle) return false;

    return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
  }
}
