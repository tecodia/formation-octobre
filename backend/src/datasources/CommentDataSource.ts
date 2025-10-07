// Step 6: DataSource avec cache Redis pour les Comments

import { prisma } from '../lib/prisma';
import { CacheManager } from '../cache/CacheManager';

export class CommentDataSource {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager("comment", 300); // TTL de 5 minutes
  }

  async getLatestComments(limit: number) {
    return await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // Queries
  async getAllComments() {
    return await this.cache.withCache(
      "all-comments",
      async () => {
        return await prisma.comment.findMany({
          orderBy: { createdAt: "desc" },
        });
      },
      60 // Cache pour 1 minute
    );
  }

  async getCommentsByPostId(postId: string) {
    return await this.cache.withCache(`comments:post:${postId}`, async () => {
      return await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
      });
    });
  }

  // Mutations
  async createComment(text: string, postId: string, authorId: string) {
    const newComment = await prisma.comment.create({
      data: {
        text,
        postId,
        authorId,
      },
    });

    // Invalider le cache après création
    await this.cache.delete("all-comments");
    await this.cache.delete(`comments:post:${postId}`);

    return newComment;
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
