// Step 7: Field resolvers pour ArticlePost

import type { GraphQLContext } from '../../context';

export const articlePostFieldResolvers = {
  ArticlePost: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.userLoader.load(parent.authorId);
    },
    comments: async (parent: any, _: any, context: GraphQLContext) => {
      return context.loaders.commentsByPostLoader.load(parent.id);
    },
    readingTime: (parent: any) => {
      // Calculer le temps de lecture basé sur le contenu
      const wordsPerMinute = 200;
      const words = parent.content.split(' ').length;
      return Math.ceil(words / wordsPerMinute);
    },
    tags: (parent: any) => {
      // Extraire les tags des metadata
      return parent.tags || [];
    },
  },
};