// Step 6: DataSource avec cache Redis pour les Posts

import { prisma } from '../lib/prisma';
import { CacheManager } from '../cache/CacheManager';

export class PostDataSource {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager("post", 300); // TTL de 5 minutes
  }

  async getPostPaginated(first: number, after: string | null) {

    if (after) {
    return await prisma.post.findMany({
      where: {
        id: {
          lt: after,
        },
      },
        take: first + 1,
        orderBy: { createdAt: "desc" },
      });
    }

    return await prisma.post.findMany({
      take: first + 1,
      orderBy: { createdAt: "desc" },
    });
  }
  // Queries
  async getAllPosts() {
    return await this.cache.withCache(
      "all-posts",
      async () => {
        return await prisma.post.findMany({
          orderBy: { createdAt: "desc" },
        });
      },
      60 // Cache pour 1 minute
    );
  }

  async getPostById(id: string) {
    return await this.cache.withCache(`post:${id}`, async () => {
      return await prisma.post.findUnique({
        where: { id },
      });
    });
  }

  async getPostsByAuthorId(authorId: string) {
    return await this.cache.withCache(`posts:author:${authorId}`, async () => {
      return await prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
      });
    });
  }

  // Mutations
  async createPost(title: string, content: string, authorId: string) {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    // Invalider le cache après création
    await this.cache.delete("all-posts");
    await this.cache.delete(`posts:author:${authorId}`);

    return newPost;
  }

  async updatePost(id: string, title?: string, content?: string) {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return null;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    // Invalider le cache après mise à jour
    await this.cache.delete(`post:${id}`);
    await this.cache.delete("all-posts");
    await this.cache.delete(`posts:author:${existingPost.authorId}`);

    return updatedPost;
  }

  // Relations
  async getAuthorByPostId(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) return null;

    return await prisma.user.findUnique({
      where: { id: post.authorId },
    });
  }

  async getCommentsByPostId(postId: string) {
    return await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });
  }
}
