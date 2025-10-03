// Step 7: Field resolvers pour VideoPost

import type { GraphQLContext } from '../../context';

export const videoPostFieldResolvers = {
  VideoPost: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.userLoader.load(parent.authorId);
    },
    comments: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.commentsByPostLoader.load(parent.id);
    },
    videoUrl: (parent: any) => {
      return parent.videoUrl || '';
    },
    duration: (parent: any) => {
      return parent.duration || 0;
    },
    thumbnail: (parent: any) => {
      return parent.thumbnail || null;
    },
    description: (parent: any) => {
      return parent.description || parent.content;
    },
    views: (parent: any) => {
      return parent.views || 0;
    },
  },
};