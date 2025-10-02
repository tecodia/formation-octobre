// Step 2: Query resolvers enrichis

import { users, posts, comments } from '../data/mockData';

export const queryResolvers = {
  hello: () => 'Hello World! Formation GraphQL Step 2 🚀',

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

  postsByAuthor: (_: any, args: { authorId: string }) => {
    return posts.filter(post => post.authorId === args.authorId);
  },

  // Comment queries (nouveau)
  comments: () => comments,

  commentsByPost: (_: any, args: { postId: string }) => {
    return comments.filter(comment => comment.postId === args.postId);
  },
};