// Mutation resolvers pour les Posts

import { PostDataSource } from '../../datasources/PostDataSource';

const postDataSource = new PostDataSource();

export const postMutationResolvers = {
  createPost: async (_: any, args: { title: string; content: string; authorId: string }) => {
    return await postDataSource.createPost(args.title, args.content, args.authorId);
  },

  updatePost: async (_: any, args: { id: string; title?: string; content?: string }) => {
    return await postDataSource.updatePost(args.id, args.title, args.content);
  },
};
