// Step 7: Field resolvers pour PollPost

import type { GraphQLContext } from '../../context';

export const pollPostFieldResolvers = {
  PollPost: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.userLoader.load(parent.authorId);
    },
    comments: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.commentsByPostLoader.load(parent.id);
    },
    question: (parent: any) => {
      return parent.title; // Le titre est utilisé comme question
    },
    options: (parent: any) => {
      return parent.options || [];
    },
    totalVotes: (parent: any) => {
      if (!parent.options) return 0;
      return parent.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0);
    },
    multipleChoice: (parent: any) => {
      return parent.multipleChoice || false;
    },
    expiresAt: (parent: any) => {
      return parent.expiresAt || null;
    },
  },
};