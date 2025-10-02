// Step 1: Mutation resolvers dans un fichier séparé

import { users, posts } from '../data/mockData';
import type { User, Post } from '../data/mockData';

let userIdCounter = 4;
let postIdCounter = 4;

export const mutationResolvers = {
  // User mutations
  createUser: (_: any, args: { name: string; email: string }): User => {
    const newUser: User = {
      id: String(userIdCounter++),
      name: args.name,
      email: args.email,
    };
    users.push(newUser);
    return newUser;
  },

  // Post mutations
  createPost: (_: any, args: { title: string; content: string; authorId: string }): Post => {
    const newPost: Post = {
      id: String(postIdCounter++),
      title: args.title,
      content: args.content,
      authorId: args.authorId,
    };
    posts.push(newPost);
    return newPost;
  },
};