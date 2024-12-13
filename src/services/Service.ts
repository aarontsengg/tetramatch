//import { createClient } from 'redis';
import { RedisClient, Devvit } from '@devvit/public-api';
//import dotenv from 'dotenv';

//dotenv.config();

/**
 * Interface representing a single puzzle.
 */
export interface Puzzle {
  puzzleId: number;
  userId: number;
  createdAt: string;
  width: number;
  height: number;
  pixels: number[][];
}

/**
 * Service class to handle interactions with Redis.
 */
export class Service {
  private redis: RedisClient;

  constructor(context: Devvit.Context) {
    console.log("Constructor called");
    this.redis = context.redis
    //yayy... super simple redis constructor... 
  }

  /**
   * Fetches a puzzle by its ID from Redis.
   * @param {string} puzzleId - The ID of the puzzle to fetch.
   * @returns {Promise<Puzzle | null>} The puzzle if found, else null.
   */
  
  public async getPuzzle(puzzleId: number): Promise<Puzzle | null> {
    const key = puzzleId.toString();

    try {
      const puzzleData = await this.redis.hGetAll(key);
      if (Object.keys(puzzleData).length === 0) {
        return null; // Puzzle not found
      }
      return {
        puzzleId: parseInt(puzzleData.puzzleId),
        userId: parseInt(puzzleData.userId),
        createdAt: puzzleData.createdAt,
        width: parseInt(puzzleData.width),
        height: parseInt(puzzleData.height),
        pixels: JSON.parse(puzzleData.pixels)
      };
    } catch (error) {
      console.error(`Error fetching puzzle ${puzzleId}:`, error);
      return null;
    }
  }

  /**
   * Saves a puzzle to Redis.
   * @param {Puzzle} puzzle - The puzzle to save.
   * @returns {Promise<boolean>} True if successful, else false.
   */

  public async savePuzzle(puzzle: Puzzle): Promise<boolean> {
    const key = puzzle.puzzleId.toString();
    
    try {
      await this.redis.hSet(key, {
        puzzleId: puzzle.puzzleId.toString(),
        userId: puzzle.userId.toString(),
        createdAt: puzzle.createdAt,
        width: puzzle.width.toString(),
        height: puzzle.height.toString(),
        pixels: JSON.stringify(puzzle.pixels)
      });
      console.log('Puzzle saved successfully using hSet');
      return true;
    } catch (error) {
      console.error(`Error saving puzzle ${puzzle.puzzleId}:`, error);
      return false;
    }
  }

  /**
   * Validates a user's solution against the stored puzzle.
   * @param {string} puzzleId - The ID of the puzzle.
   * @param {number[][]} userSolution - The user's solution.
   * @returns {Promise<boolean>} True if valid, else false.
   */
  public async validateSolution(puzzleId: number, userSolution: number[][]): Promise<boolean> {
    const puzzle = await this.getPuzzle(puzzleId);
    if (!puzzle) {
      console.warn(`Puzzle ${puzzleId} not found for validation.`);
      return false;
    }

    // Deep comparison
    return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels); // seems good to me 
  }

  /**
   * Adds a new puzzle to the database.
   * @param {Puzzle} newPuzzle - The puzzle to add.
   * @returns {Promise<boolean>} True if added successfully, else false.
   */
  public async addNewPuzzle(newPuzzle: Puzzle): Promise<boolean> {
    const existingPuzzle = await this.getPuzzle(newPuzzle.puzzleId);
    if (existingPuzzle) {
      console.warn(`Puzzle ${newPuzzle.puzzleId} already exists.`);
      return false;
    }
    // also add to the user database lol
    return await this.savePuzzle(newPuzzle);
  }
  // We do NOT need to edit user database. that is out of scope for this context 
  // plus, that wouldn't help us anyway... 
  /*public async setFollowerCount(userId, newCount, context) {
    const hashKey = `user:${userId}`;
    const field = 'numFollowers';
    
    await context.redis.hSet(hashKey, { [field]: newCount.toString() });
    
    console.log(`Set follower count for user ${userId} to ${newCount}`);
  }*/
}

export default Service;
