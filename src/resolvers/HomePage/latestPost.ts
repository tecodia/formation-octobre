import { PostDataSource } from "../../datasources/PostDataSource";

const postDataSource = new PostDataSource();

export const latestPostResolvers = {
  latestPosts: async (_: any, args: any) => {
    return await postDataSource.getLatestPosts(args.limit);
  },
};