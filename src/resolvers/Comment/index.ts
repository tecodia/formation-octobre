// Field resolvers pour Comment (relations)

import { UserDataSource } from '../../datasources/UserDataSource';
import { PostDataSource } from '../../datasources/PostDataSource';

const userDataSource = new UserDataSource();
const postDataSource = new PostDataSource();

export const commentFieldResolvers = {
  post: async (parent: { postId: string }) => {
    return await postDataSource.getPostById(parent.postId);
  },

  author: async (parent: { authorId: string }) => {
    return await userDataSource.getUserById(parent.authorId);
  },
};
