// Mutation resolvers pour les Comments

import { CommentDataSource } from '../../datasources/CommentDataSource';

const commentDataSource = new CommentDataSource();

export const commentMutationResolvers = {
  createComment: async (_: any, args: { text: string; postId: string; authorId: string }) => {
    return await commentDataSource.createComment(args.text, args.postId, args.authorId);
  },
};
