// Field resolvers pour User (relations)

import { UserDataSource } from '../../datasources/UserDataSource';

const userDataSource = new UserDataSource();

export const userFieldResolvers = {
  posts: async (parent: { id: string }) => {
    return await userDataSource.getPostsByUserId(parent.id);
  },

  comments: async (parent: { id: string }) => {
    return await userDataSource.getCommentsByUserId(parent.id);
  },
};
