import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => console.error('Redis Client Error', err));

const testRedis = async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');

    await client.set('test-key', 'Redis is working!');
    const value = await client.get('test-key');
    console.log('Value of test-key:', value);

    await client.del('test-key');
    console.log('Deleted test-key');

    await client.disconnect();
    console.log('Disconnected from Redis');
  } catch (error) {
    console.error('Error testing Redis:', error);
  }
};

testRedis();
