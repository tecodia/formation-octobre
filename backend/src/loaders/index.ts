// Step 5: Point d'entrée pour tous les DataLoaders
import { createUserLoader } from './userLoader';
import { createPostLoader, createPostsByAuthorLoader } from './postLoader';
import { createCommentsByPostLoader, createCommentsByAuthorLoader } from './commentLoader';

export interface DataLoaders {
  userLoader: ReturnType<typeof createUserLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
  postsByAuthorLoader: ReturnType<typeof createPostsByAuthorLoader>;
  commentsByPostLoader: ReturnType<typeof createCommentsByPostLoader>;
  commentsByAuthorLoader: ReturnType<typeof createCommentsByAuthorLoader>;
}

// Créer tous les loaders pour une requête GraphQL
export function createLoaders(): DataLoaders {
  return {
    userLoader: createUserLoader(),
    postLoader: createPostLoader(),
    postsByAuthorLoader: createPostsByAuthorLoader(),
    commentsByPostLoader: createCommentsByPostLoader(),
    commentsByAuthorLoader: createCommentsByAuthorLoader()
  };
}