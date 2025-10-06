// DataSource pour encapsuler toutes les opérations Prisma liées aux Comments

import { prisma } from '../lib/prisma';

export class CommentDataSource {
  // Queries
  async getAllComments() {
    return await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getLatestComments(limit: number) {
    return await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getCommentsByPostId(postId: string) {
    return await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });
  }

  // Mutations
  async createComment(text: string, postId: string, authorId: string) {
    return await prisma.comment.create({
      data: {
        text,
        postId,
        authorId,
      },
    });
  }

  // Relations
  async getPostByCommentId(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });

    if (!comment) return null;

    return await prisma.post.findUnique({
      where: { id: comment.postId },
    });
  }

  async getAuthorByCommentId(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) return null;

    return await prisma.user.findUnique({
      where: { id: comment.authorId },
    });
  }
}
