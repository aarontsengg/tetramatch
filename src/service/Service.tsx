import fs from 'fs';
import path from 'path';

/**
 * Interface representing a single puzzle.
 */
export interface Puzzle {
  puzzleId: string;
  width: number;
  height: number;
  pixels: number[][];
}

/**
 * Interface representing the structure of puzzles.json.
 */
interface PuzzlesData {
  puzzles: Puzzle[];
}

/**
 * Service class to handle CRUD operations on puzzles.json.
 */
export class PuzzleService {
  private puzzlesFilePath: string;
  private puzzlesData: PuzzlesData;

  constructor() {
    // Define the path to puzzles.json
    this.puzzlesFilePath = path.join(__dirname, '../data/puzzles.json');

    // Initialize puzzles data
    this.puzzlesData = this.readPuzzlesFile();
  }

  /**
   * Reads and parses puzzles.json.
   * @returns {PuzzlesData} Parsed puzzles data.
   */
  private readPuzzlesFile(): PuzzlesData {
    try {
      const data = fs.readFileSync(this.puzzlesFilePath, 'utf-8');
      return JSON.parse(data) as PuzzlesData;
    } catch (error) {
      console.error('Error reading puzzles.json:', error);
      // Initialize with empty puzzles array if file doesn't exist or is corrupted
      return { puzzles: [] };
    }
  }

  /**
   * Writes the current puzzles data back to puzzles.json.
   */
  private writePuzzlesFile(): void {
    try {
      fs.writeFileSync(this.puzzlesFilePath, JSON.stringify(this.puzzlesData, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to puzzles.json:', error);
    }
  }

  /**
   * Retrieves all puzzles.
   * @returns {Puzzle[]} Array of all puzzles.
   */
  public getAllPuzzles(): Puzzle[] {
    return this.puzzlesData.puzzles;
  }

  /**
   * Retrieves a puzzle by its ID.
   * @param {string} puzzleId - The ID of the puzzle to retrieve.
   * @returns {Puzzle | null} The puzzle if found, else null.
   */
  public getPuzzleById(puzzleId: string): Puzzle | null {
    const puzzle = this.puzzlesData.puzzles.find(p => p.puzzleId === puzzleId);
    return puzzle || null;
  }

  /**
   * Validates a user's solution against the stored puzzle.
   * @param {number[][]} userSolution - The user's solution to validate.
   * @param {string} puzzleId - The ID of the puzzle to validate against.
   * @returns {boolean} True if the solution is correct, else false.
   */
  public validateSolution(userSolution: number[][], puzzleId: string): boolean {
    const puzzle = this.getPuzzleById(puzzleId);
    if (!puzzle) {
      console.warn(`Puzzle with ID ${puzzleId} not found.`);
      return false;
    }

    // Deep comparison of the user's solution and the puzzle's pixels
    return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
  }

  /**
   * Adds a new puzzle to puzzles.json.
   * @param {Puzzle} newPuzzle - The puzzle to add.
   * @returns {boolean} True if the puzzle was added successfully, else false.
   */
  public addPuzzle(newPuzzle: Puzzle): boolean {
    // Check if a puzzle with the same ID already exists
    const exists = this.puzzlesData.puzzles.some(p => p.puzzleId === newPuzzle.puzzleId);
    if (exists) {
      console.warn(`Puzzle with ID ${newPuzzle.puzzleId} already exists.`);
      return false;
    }

    // Add the new puzzle
    this.puzzlesData.puzzles.push(newPuzzle);

    // Write the updated puzzles data back to puzzles.json
    this.writePuzzlesFile();

    return true;
  }

  /**
   * Removes a puzzle by its ID.
   * @param {string} puzzleId - The ID of the puzzle to remove.
   * @returns {boolean} True if the puzzle was removed successfully, else false.
   */
  public removePuzzle(puzzleId: string): boolean {
    const initialLength = this.puzzlesData.puzzles.length;
    this.puzzlesData.puzzles = this.puzzlesData.puzzles.filter(p => p.puzzleId !== puzzleId);

    if (this.puzzlesData.puzzles.length === initialLength) {
      console.warn(`Puzzle with ID ${puzzleId} not found.`);
      return false;
    }

    this.writePuzzlesFile();
    return true;
  }

  /**
   * Updates an existing puzzle.
   * @param {string} puzzleId - The ID of the puzzle to update.
   * @param {Partial<Puzzle>} updatedFields - The fields to update.
   * @returns {boolean} True if the puzzle was updated successfully, else false.
   */
  public updatePuzzle(puzzleId: string, updatedFields: Partial<Puzzle>): boolean {
    const puzzle = this.getPuzzleById(puzzleId);
    if (!puzzle) {
      console.warn(`Puzzle with ID ${puzzleId} not found.`);
      return false;
    }

    // Update the puzzle fields
    Object.assign(puzzle, updatedFields);

    // Write the updated puzzles data back to puzzles.json
    this.writePuzzlesFile();

    return true;
  }
}
