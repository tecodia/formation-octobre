// Step 8: Resolvers pour les subscriptions de commentaires

import { pubsub, SUBSCRIPTION_EVENTS } from '../../lib/pubsub';
import { withFilter } from 'graphql-subscriptions';

export const commentSubscriptionResolvers = {
  // Subscription pour tous les nouveaux commentaires
  commentAdded: {
    subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]),
  },

  // Subscription pour les commentaires d'un post spécifique
  commentAddedToPost: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]),
      (payload, variables) => {
        // Filtrer pour ne renvoyer que les commentaires du post demandé
        return payload.comment.postId === variables.postId;
      }
    ),
  },
};