import { Router, Request, Response } from 'express';
import { PuzzleService, Puzzle } from '../service/service';

const router = Router();
const puzzleService = new PuzzleService();

/**
 * GET /api/puzzles
 * Retrieves all puzzles.
 */
router.get('/', (req: Request, res: Response) => {
  const puzzles = puzzleService.getAllPuzzles();
  res.json(puzzles);
});

/**
 * GET /api/puzzles/:id
 * Retrieves a specific puzzle by ID.
 */
router.get('/:id', (req: Request, res: Response) => {
  const puzzleId = req.params.id;
  const puzzle = puzzleService.getPuzzleById(puzzleId);

  if (puzzle) {
    res.json(puzzle);
  } else {
    res.status(404).json({ message: 'Puzzle not found.' });
  }
});

/**
 * POST /api/puzzles/:id/validate
 * Validates a user's solution against the puzzle.
 */
router.post('/:id/validate', (req: Request, res: Response) => {
  const puzzleId = req.params.id;
  const { userSolution } = req.body;

  if (!userSolution || !Array.isArray(userSolution)) {
    return res.status(400).json({ message: 'Invalid user solution.' });
  }

  const isValid = puzzleService.validateSolution(userSolution, puzzleId);
  res.json({ isValid });
});

/**
 * POST /api/puzzles
 * Adds a new puzzle.
 */
router.post('/', (req: Request, res: Response) => {
  const { puzzleId, width, height, pixels } = req.body;

  if (!puzzleId || !width || !height || !pixels) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newPuzzle: Puzzle = { puzzleId, width, height, pixels };
  const success = puzzleService.addPuzzle(newPuzzle);

  if (success) {
    res.status(201).json({ message: 'Puzzle added successfully.' });
  } else {
    res.status(400).json({ message: 'Puzzle ID already exists.' });
  }
});

/**
 * DELETE /api/puzzles/:id
 * Removes a puzzle by ID.
 */
router.delete('/:id', (req: Request, res: Response) => {
  const puzzleId = req.params.id;
  const success = puzzleService.removePuzzle(puzzleId);

  if (success) {
    res.json({ message: 'Puzzle removed successfully.' });
  } else {
    res.status(404).json({ message: 'Puzzle not found.' });
  }
});

/**
 * PUT /api/puzzles/:id
 * Updates an existing puzzle.
 */
router.put('/:id', (req: Request, res: Response) => {
  const puzzleId = req.params.id;
  const updatedFields = req.body;

  if (!updatedFields || typeof updatedFields !== 'object') {
    return res.status(400).json({ message: 'Invalid update data.' });
  }

  const success = puzzleService.updatePuzzle(puzzleId, updatedFields);

  if (success) {
    res.json({ message: 'Puzzle updated successfully.' });
  } else {
    res.status(404).json({ message: 'Puzzle not found.' });
  }
});

export default router;
