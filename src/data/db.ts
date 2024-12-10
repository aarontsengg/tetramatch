import mongoose from 'mongoose';

export async function connectDB() {
  const uri = 'mongodb://localhost:27017/mongo'; // or your MongoDB URI
  await mongoose.connect(uri);
  console.log('Connected to MongoDB with Mongoose');
}
