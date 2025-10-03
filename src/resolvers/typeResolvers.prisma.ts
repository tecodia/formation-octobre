// Step 3: Field resolvers pour les relations avec Prisma

import { prisma } from '../lib/prisma';

// Field resolvers pour User
export const userResolvers = {
  posts: async (parent: { id: string }) => {
    // Trouve tous les posts de cet auteur
    return await prisma.post.findMany({
      where: { authorId: parent.id },
      orderBy: { createdAt: 'desc' },
    });
  },
  comments: async (parent: { id: string }) => {
    // Trouve tous les commentaires de cet auteur
    return await prisma.comment.findMany({
      where: { authorId: parent.id },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Field resolvers pour Post
export const postResolvers = {
  author: async (parent: { authorId: string }) => {
    // Trouve l'auteur du post
    return await prisma.user.findUnique({
      where: { id: parent.authorId },
    });
  },
  comments: async (parent: { id: string }) => {
    // Trouve tous les commentaires du post
    return await prisma.comment.findMany({
      where: { postId: parent.id },
      orderBy: { createdAt: 'asc' },
    });
  },
};

// Field resolvers pour Comment
export const commentResolvers = {
  post: async (parent: { postId: string }) => {
    // Trouve le post du commentaire
    return await prisma.post.findUnique({
      where: { id: parent.postId },
    });
  },
  author: async (parent: { authorId: string }) => {
    // Trouve l'auteur du commentaire
    return await prisma.user.findUnique({
      where: { id: parent.authorId },
    });
  },
};
