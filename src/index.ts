// src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puzzleController from './controllers/puzzleController';
import testController from './controllers/testController'; // Import the test controller

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Middleware
app.use(cors({
  origin: `http://localhost:${process.env.PORT_FRONTEND || 3000}`, // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Routes
app.use('/api/puzzles', puzzleController);
app.use('/api', testController); // Add the test route

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
