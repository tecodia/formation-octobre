// Step 8: PubSub pour les subscriptions GraphQL
import { PubSub } from 'graphql-subscriptions';

// Créer une instance unique de PubSub
export const pubsub = new PubSub();

// Événements disponibles
export const SUBSCRIPTION_EVENTS = {
  COMMENT_ADDED: 'COMMENT_ADDED',
  POST_CREATED: 'POST_CREATED',
  POST_UPDATED: 'POST_UPDATED',
} as const;