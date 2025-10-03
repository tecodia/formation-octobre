// Step 5: Field resolvers pour Comment avec DataLoaders

import type { GraphQLContext } from '../../context';

export const commentFieldResolvers = {
  post: async (parent: { postId: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes Post
    return context.loaders.postLoader.load(parent.postId);
  },

  author: async (parent: { authorId: string }, _: any, context: GraphQLContext) => {
    // Utiliser le DataLoader pour batcher les requêtes User
    return context.loaders.userLoader.load(parent.authorId);
  },

  createdAt: (parent: { createdAt: Date | string }) => {
    return parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt;
  },

  updatedAt: (parent: { updatedAt: Date | string }) => {
    return parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt;
  },
};
