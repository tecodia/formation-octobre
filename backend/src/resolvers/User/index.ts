// Step 5: Field resolvers pour User avec DataLoaders

import type { GraphQLContext } from '../../context';

export const userFieldResolvers = {
  posts: async (parent: { id: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes
    return context.loaders.postsByAuthorLoader.load(parent.id);
  },

  comments: async (parent: { id: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes
    return context.loaders.commentsByAuthorLoader.load(parent.id);
  },
};
