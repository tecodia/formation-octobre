// Mutation resolvers pour les Posts

import { PostDataSource } from '../../datasources/PostDataSource';

const postDataSource = new PostDataSource();

interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

export const postMutationResolvers = {
  createPost: async (_: any, args: { input: CreatePostInput }) => {
    return await postDataSource.createPost(
      args.input.title,
      args.input.content,
      args.input.authorId
    );
  },

  updatePost: async (
    _: any,
    args: { id: string; title?: string; content?: string }
  ) => {
    return await postDataSource.updatePost(args.id, args.title, args.content);
  },
};
