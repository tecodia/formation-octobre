// Step 1: Query resolvers dans un fichier séparé

import { users, posts } from '../data/mockData';

export const queryResolvers = {
  hello: () => 'Hello World! Formation GraphQL Step 1 🚀',

  // User queries
  users: () => users,

  user: (_: any, args: { id: string }) => {
    return users.find(user => user.id === args.id);
  },

  // Post queries
  posts: () => posts,

  post: (_: any, args: { id: string }) => {
    return posts.find(post => post.id === args.id);
  },
};