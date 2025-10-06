// Fichier principal des resolvers - Architecture refactorisée avec DataSources

import { userQueryResolvers } from './Query/users';
import { postQueryResolvers } from './Query/posts';
import { commentQueryResolvers } from './Query/comments';

import { userMutationResolvers } from './Mutation/userMutations';
import { postMutationResolvers } from './Mutation/postMutations';
import { commentMutationResolvers } from './Mutation/commentMutations';

import { userFieldResolvers } from './User';
import { postFieldResolvers } from './Post';
import { commentFieldResolvers } from './Comment';
import { feedQueryResolvers } from "./Query/feed";
import { notificationQueryResolvers } from "./Query/notification";

export const resolvers = {
  Query: {
    hello: () =>
      "Hello World! Formation GraphQL Step 3 - Architecture refactorisée avec DataSources",
    ...userQueryResolvers,
    ...postQueryResolvers,
    ...commentQueryResolvers,
    ...feedQueryResolvers,
    ...notificationQueryResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
    ...postMutationResolvers,
    ...commentMutationResolvers,
  },
  // Field resolvers pour les relations
  User: userFieldResolvers,
  Post: postFieldResolvers,
  Comment: commentFieldResolvers,
};
