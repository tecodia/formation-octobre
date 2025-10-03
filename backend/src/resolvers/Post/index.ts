// Step 5: Field resolvers pour Post avec DataLoaders

import type { GraphQLContext } from '../../context';

export const postFieldResolvers = {
  author: async (parent: { authorId: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes User
    return context.loaders.userLoader.load(parent.authorId);
  },

  comments: async (parent: { id: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes Comment
    return context.loaders.commentsByPostLoader.load(parent.id);
  },

  createdAt: (parent: { createdAt: Date | string }) => {
    return parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt;
  },

  updatedAt: (parent: { updatedAt: Date | string }) => {
    return parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt;
  },
};
