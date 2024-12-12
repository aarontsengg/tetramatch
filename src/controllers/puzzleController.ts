import { Router, Request, Response } from 'express';
import Service from '../services/Service';

const router = Router();
const service = new Service();

/**
 * GET /api/puzzles/:id
 * Retrieves a specific puzzle by ID.
 */
router.get('/:id', async (req: Request, res: Response) => {
  const puzzleId = parseInt(req.params.id);

  try {
    const puzzle = await service.getPuzzle(puzzleId);
    if (puzzle) {
      res.json(puzzle);
    } else {
      res.status(404).json({ message: 'Puzzle not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * POST /api/puzzles
 * Adds a new puzzle.
 */
router.post('/', async (req: Request, res: Response) => {
  const { puzzleId, userId, createdAt, width, height, pixels } = req.body;

  if (!puzzleId || !width || !height || !pixels) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newPuzzle = { puzzleId, userId, createdAt, width, height, pixels };

  try {
    const success = await service.addNewPuzzle(newPuzzle);
    if (success) {
      res.status(201).json({ message: 'Puzzle added successfully.' });
    } else {
      res.status(400).json({ message: 'Puzzle ID already exists.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});



/**
 * POST /api/puzzles/:id/validate
 * Validates a user's solution.
 */
router.post('/:id/validate', async (req: Request, res: Response) => {
  const puzzleId = parseInt(req.params.id);
  const { userSolution } = req.body;

  if (!userSolution || !Array.isArray(userSolution)) {
    return res.status(400).json({ message: 'Invalid user solution.' });
  }

  try {
    const isValid = await service.validateSolution(puzzleId, userSolution);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;