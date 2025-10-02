// Step 2: Fichier principal des resolvers avec type resolvers

import { queryResolvers } from './queryResolvers';
import { mutationResolvers } from './mutationResolvers';
import { userResolvers, postResolvers, commentResolvers } from './typeResolvers';

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  // Field resolvers pour les relations
  User: userResolvers,
  Post: postResolvers,
  Comment: commentResolvers,
};