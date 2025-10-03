// Step 6: Gestionnaire de cache avec Redis
import { redisClient } from '../lib/redis';

export class CacheManager {
  private prefix: string;
  private defaultTTL: number;

  constructor(prefix: string = 'graphql', defaultTTL: number = 3600) {
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
  }

  // Générer une clé de cache
  private makeKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  // Récupérer depuis le cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(this.makeKey(key));
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Stocker dans le cache
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const finalTTL = ttl || this.defaultTTL;
      await redisClient.setex(this.makeKey(key), finalTTL, serialized);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Supprimer du cache
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(this.makeKey(key));
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Invalider plusieurs clés par pattern
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(this.makeKey(pattern));
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  // Wrapper pour exécuter avec cache
  async withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Essayer de récupérer depuis le cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Si pas dans le cache, exécuter la fonction
    const result = await fetchFn();

    // Stocker le résultat dans le cache
    await this.set(key, result, ttl);

    return result;
  }
}