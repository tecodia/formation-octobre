// Step 2: Mutation resolvers enrichis

import { users, posts, comments } from '../data/mockData';
import type { User, Post, Comment } from '../data/mockData';

let userIdCounter = 4;
let postIdCounter = 4;
let commentIdCounter = 4;

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

  updateUser: (_: any, args: { id: string; name?: string; email?: string }): User | null => {
    const user = users.find(u => u.id === args.id);
    if (!user) return null;

    if (args.name) user.name = args.name;
    if (args.email) user.email = args.email;

    return user;
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

  updatePost: (_: any, args: { id: string; title?: string; content?: string }): Post | null => {
    const post = posts.find(p => p.id === args.id);
    if (!post) return null;

    if (args.title) post.title = args.title;
    if (args.content) post.content = args.content;

    return post;
  },

  // Comment mutations (nouveau)
  createComment: (_: any, args: { text: string; postId: string; authorId: string }): Comment => {
    const newComment: Comment = {
      id: String(commentIdCounter++),
      text: args.text,
      postId: args.postId,
      authorId: args.authorId,
    };
    comments.push(newComment);
    return newComment;
  },
};