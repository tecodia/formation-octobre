// Step 3: Query resolvers avec Prisma

import { prisma } from '../lib/prisma';

export const queryResolvers = {
  hello: () => 'Hello World! Formation GraphQL Step 3 avec Prisma et PostgreSQL 🚀',

  // User queries
  users: async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  user: async (_: any, args: { id: string }) => {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },

  // Post queries
  posts: async () => {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  post: async (_: any, args: { id: string }) => {
    return await prisma.post.findUnique({
      where: { id: args.id },
    });
  },

  postsByAuthor: async (_: any, args: { authorId: string }) => {
    return await prisma.post.findMany({
      where: { authorId: args.authorId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Comment queries
  comments: async () => {
    return await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  commentsByPost: async (_: any, args: { postId: string }) => {
    return await prisma.comment.findMany({
      where: { postId: args.postId },
      orderBy: { createdAt: 'asc' },
    });
  },
};
