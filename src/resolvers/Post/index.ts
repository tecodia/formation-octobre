// Field resolvers pour Post (relations)

import { UserDataSource } from '../../datasources/UserDataSource';
import { CommentDataSource } from '../../datasources/CommentDataSource';

const userDataSource = new UserDataSource();
const commentDataSource = new CommentDataSource();

export const postFieldResolvers = {
  author: async (parent: { authorId: string }) => {
    return await userDataSource.getUserById(parent.authorId);
  },

  comments: async (parent: { id: string }) => {
    return await commentDataSource.getCommentsByPostId(parent.id);
  },
};
