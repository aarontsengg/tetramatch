import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
  puzzleId: { type: String, required: true, unique: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  pixels: {
    type: [[Number]], // Array of arrays of numbers
    required: true
  },
});

export const Puzzle = mongoose.model('Puzzle', puzzleSchema);
