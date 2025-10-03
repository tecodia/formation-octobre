// Test simple pour vérifier que PubSub fonctionne
import pkg from 'graphql-subscriptions';
const { PubSub } = pkg;

const pubsub = new PubSub();

console.log('PubSub instance:', pubsub);
console.log('Has asyncIterator?', typeof pubsub.asyncIterator === 'function');

// Test
const iterator = pubsub.asyncIterator(['TEST_EVENT']);
console.log('Iterator created:', iterator);

pubsub.publish('TEST_EVENT', { test: 'data' });
console.log('Event published');

console.log('Test completed successfully!');