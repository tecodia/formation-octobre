// Step 6: DataSource avec cache Redis pour les Users

import { prisma } from '../lib/prisma';
import { CacheManager } from '../cache/CacheManager';

export class UserDataSource {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager('user', 300); // TTL de 5 minutes
  }
  // Queries
  async getAllUsers() {
    return await this.cache.withCache(
      'all-users',
      async () => {
        return await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
        });
      },
      60 // Cache pour 1 minute
    );
  }

  async getUserById(id: string) {
    return await this.cache.withCache(
      `user:${id}`,
      async () => {
        return await prisma.user.findUnique({
          where: { id },
        });
      }
    );
  }

  // Mutations
  async createUser(name: string, email: string) {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // Invalider le cache après création
    await this.cache.delete('all-users');

    return newUser;
  }

  async updateUser(id: string, name?: string, email?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    // Invalider le cache après mise à jour
    await this.cache.delete(`user:${id}`);
    await this.cache.delete('all-users');

    return updatedUser;
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
