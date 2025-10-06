import { CommentDataSource } from "../../datasources/CommentDataSource";

const commentDataSource = new CommentDataSource();

export const latestCommentResolvers = {
  latestComments: async (_: any, args: any) => {
    return await commentDataSource.getLatestComments(args.limit);
  },
};