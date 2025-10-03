// Step 3: Mutation resolvers avec Prisma

import { prisma } from '../lib/prisma';

export const mutationResolvers = {
  // User mutations
  createUser: async (_: any, args: { name: string; email: string }) => {
    return await prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
      },
    });
  },

  updateUser: async (_: any, args: { id: string; name?: string; email?: string }) => {
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: args.id },
    });

    if (!existingUser) {
      return null;
    }

    // Mise à jour
    return await prisma.user.update({
      where: { id: args.id },
      data: {
        ...(args.name && { name: args.name }),
        ...(args.email && { email: args.email }),
      },
    });
  },

  // Post mutations
  createPost: async (_: any, args: { title: string; content: string; authorId: string }) => {
    return await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: args.authorId,
      },
    });
  },

  updatePost: async (_: any, args: { id: string; title?: string; content?: string }) => {
    // Vérifier si le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: args.id },
    });

    if (!existingPost) {
      return null;
    }

    // Mise à jour
    return await prisma.post.update({
      where: { id: args.id },
      data: {
        ...(args.title && { title: args.title }),
        ...(args.content && { content: args.content }),
      },
    });
  },

  // Comment mutations
  createComment: async (_: any, args: { text: string; postId: string; authorId: string }) => {
    return await prisma.comment.create({
      data: {
        text: args.text,
        postId: args.postId,
        authorId: args.authorId,
      },
    });
  },
};
