// DataSource pour encapsuler toutes les opérations Prisma liées aux Posts

import { prisma } from '../lib/prisma';

export class PostDataSource {
  // Queries
  async getAllPosts() {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
    });
  }

  async getPostsByAuthorId(authorId: string) {
    return await prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mutations
  async createPost(title: string, content: string, authorId: string) {
    return await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
  }

  async updatePost(id: string, title?: string, content?: string) {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return null;
    }

    return await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });
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
      orderBy: { createdAt: 'asc' },
    });
  }
}
