// Step 7: Field resolvers pour ImagePost

import type { GraphQLContext } from '../../context';

export const imagePostFieldResolvers = {
  ImagePost: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.userLoader.load(parent.authorId);
    },
    comments: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.commentsByPostLoader.load(parent.id);
    },
    images: (parent: any) => {
      return parent.images || [];
    },
    description: (parent: any) => {
      return parent.description || parent.content;
    },
  },
};