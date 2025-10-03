// Step 3: Fichier principal des resolvers avec Prisma

import { queryResolvers } from './queryResolvers.prisma';
import { mutationResolvers } from './mutationResolvers.prisma';
import { userResolvers, postResolvers, commentResolvers } from './typeResolvers.prisma';

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  // Field resolvers pour les relations
  User: userResolvers,
  Post: postResolvers,
  Comment: commentResolvers,
};
