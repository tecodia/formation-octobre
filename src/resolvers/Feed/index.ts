// Step 7: Field resolvers pour Feed

import type { GraphQLContext } from '../../context';

export const feedFieldResolvers = {
  Feed: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      // Utiliser le DataLoader pour récupérer l'auteur
      return context.loaders.userLoader.load(parent.content.authorId);
    },
  },
};