// Step 8: PubSub Redis pour les subscriptions GraphQL
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

// Options Redis pour le PubSub
const options = {
  host: 'localhost',
  port: 6379,
  retryStrategy: (times: number) => {
    // Reconnect après 2 secondes
    return Math.min(times * 50, 2000);
  },
};

// Créer une instance de Redis PubSub avec deux clients Redis (publisher et subscriber)
export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

// Événements disponibles
export const SUBSCRIPTION_EVENTS = {
  COMMENT_ADDED: "COMMENT_ADDED",
  POST_CREATED: "POST_CREATED",
  POST_UPDATED: "POST_UPDATED",
  USER_CREATED: "USER_CREATED",
} as const;