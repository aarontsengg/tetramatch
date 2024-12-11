import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puzzleRoutes from './controllers/puzzlesController';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Middleware
app.use(cors({
  origin: `http://localhost:${process.env.PORT_FRONTEND || 3000}`, // Frontend URL
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Routes
app.use('/api/puzzles', puzzleRoutes);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Backend is healthy');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
