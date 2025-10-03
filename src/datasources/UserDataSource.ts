// DataSource pour encapsuler toutes les opérations Prisma liées aux Users

import { prisma } from '../lib/prisma';

export class UserDataSource {
  // Queries
  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Mutations
  async createUser(name: string, email: string) {
    return await prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }

  async updateUser(id: string, name?: string, email?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null;
    }

    return await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });
  }

  // Relations
  async getPostsByUserId(userId: string) {
    return await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCommentsByUserId(userId: string) {
    return await prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
