// Step 7: Query resolvers pour le Feed avec unions

import { PostDataSource } from '../../datasources/PostDataSource';

const postDataSource = new PostDataSource();

export const feedQueryResolvers = {
  feed: async () => {
    const posts = await postDataSource.getAllPosts();

    // Transformer les posts en Feed items avec le contenu approprié
    return posts.map(post => ({
      id: post.id,
      author: null, // Sera résolu par le field resolver
      content: {
        ...post,
        // Enrichir avec les metadata spécifiques selon le type
        ...(post.metadata as object || {})
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  },

  feedItem: async (_: any, args: { id: string }) => {
    const post = await postDataSource.getPostById(args.id);
    if (!post) return null;

    return {
      id: post.id,
      author: null, // Sera résolu par le field resolver
      content: {
        ...post,
        ...(post.metadata as object || {})
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
};