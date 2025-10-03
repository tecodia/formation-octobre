// Step 6: Client Redis pour le cache
import Redis from 'ioredis';

// Configuration Redis
const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Gestion des événements Redis
redisClient.on('connect', () => {
  console.log('✅ Connecté à Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Erreur Redis:', err);
});

export { redisClient };