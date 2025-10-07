// Query resolvers pour les Comments

import { CommentDataSource } from '../../datasources/CommentDataSource';

const commentDataSource = new CommentDataSource();

export const commentQueryResolvers = {
  comments: async () => {
    return await commentDataSource.getAllComments();
  },

  commentsByPost: async (_: any, args: { postId: string }) => {
    return await commentDataSource.getCommentsByPostId(args.postId);
  },

  latestComments: async (_: any, args: { limit: number }) => {
    return await commentDataSource.getLatestComments(args.limit);
  },
};
