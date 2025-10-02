// Step 1: Fichier principal des resolvers

import { queryResolvers } from './queryResolvers';
import { mutationResolvers } from './mutationResolvers';

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};