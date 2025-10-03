// Query resolvers pour les Posts

import { PostDataSource } from '../../datasources/PostDataSource';

const postDataSource = new PostDataSource();

export const postQueryResolvers = {
  posts: async () => {
    return await postDataSource.getAllPosts();
  },

  post: async (_: any, args: { id: string }) => {
    return await postDataSource.getPostById(args.id);
  },

  postsByAuthor: async (_: any, args: { authorId: string }) => {
    return await postDataSource.getPostsByAuthorId(args.authorId);
  },
};
