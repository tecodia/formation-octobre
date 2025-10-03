// Step 7: Field resolvers pour Feed

import type { GraphQLContext } from '../../context';

export const feedFieldResolvers = {
  Feed: {
    author: async (parent: any, _: any, context: GraphQLContext) => {
      // Utiliser le DataLoader pour récupérer l'auteur
      // L'authorId peut être à la racine ou dans content selon d'où vient la donnée
      const authorId = parent.authorId || parent.content?.authorId;
      if (!authorId) {
        return null;
      }
      return context.loaders.userLoader.load(authorId);
    },
  },
};