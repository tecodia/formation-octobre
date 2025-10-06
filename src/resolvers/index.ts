// Step 1: Fichier principal des resolvers

import { queryResolvers } from './queryResolvers';
import { mutationResolvers } from './mutationResolvers';
import { userResolver } from "./post/userResolver";

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Post: {
    user: userResolver,
  },
};