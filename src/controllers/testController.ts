import { Router, Request, Response } from 'express';
import Service from '../services/Service';

const router = Router();
const service = new Service();

/**
 * GET /api/test-redis
 * Tests the Redis connection by setting and getting a test key.
 */
router.get('/test-redis', async (req: Request, res: Response) => {
  try {
    await service['redisClient'].set('test-key', 'Redis is working!');
    const value = await service['redisClient'].get('test-key');
    res.json({ message: value });
  } catch (error) {
    console.error('Redis test failed:', error);
    res.status(500).json({ message: 'Redis connection failed.' });
  }
});

export default router;
