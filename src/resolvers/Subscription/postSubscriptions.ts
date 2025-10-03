// Step 8: Resolvers pour les subscriptions de posts

import { pubsub, SUBSCRIPTION_EVENTS } from '../../lib/pubsub';
import { withFilter } from 'graphql-subscriptions';

export const postSubscriptionResolvers = {
  // Subscription pour les nouveaux posts
  postCreated: {
    subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.POST_CREATED]),
  },

  // Subscription pour les mises à jour d'un post spécifique
  postUpdated: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.POST_UPDATED]),
      (payload, variables) => {
        // Filtrer pour ne renvoyer que les mises à jour du post demandé
        return payload.post.id === variables.postId;
      }
    ),
  },
};