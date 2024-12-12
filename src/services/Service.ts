import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Interface representing a single puzzle.
 */
interface Puzzle {
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
class Service {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    // Initialize Redis client with environment variables
    this.redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost', // Use 'localhost' since Redis is exposed on host
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined, // If Redis is secured with a password
    });

    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Connect to Redis
    this.redisClient.connect().then(() => {
      console.log('Connected to Redis');
    }).catch(err => {
      console.error('Failed to connect to Redis:', err);
    });
  }

  /**
   * Fetches a puzzle by its ID from Redis.
   * @param {string} puzzleId - The ID of the puzzle to fetch.
   * @returns {Promise<Puzzle | null>} The puzzle if found, else null.
   */
  public async getPuzzle(puzzleId: number): Promise<Puzzle | null> {
    try {
      const puzzleData = await this.redisClient.get(`puzzle:${puzzleId}`);
      if (puzzleData) {
        return JSON.parse(puzzleData) as Puzzle;
      }
      return null;
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
    try {
      await this.redisClient.set(`puzzle:${puzzle.puzzleId}`, JSON.stringify(puzzle));
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
    return JSON.stringify(userSolution) === JSON.stringify(puzzle.pixels);
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

    return await this.savePuzzle(newPuzzle);
  }
}

export default Service;
