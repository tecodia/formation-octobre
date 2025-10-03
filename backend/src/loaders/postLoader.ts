// Step 5: DataLoader pour optimiser les requêtes Post
import DataLoader from 'dataloader';
import { prisma } from '../lib/prisma';
import type { Post } from '@prisma/client';

// Batch function pour charger plusieurs posts par IDs
async function batchPosts(ids: readonly string[]): Promise<(Post | null)[]> {
  const posts = await prisma.post.findMany({
    where: {
      id: {
        in: ids as string[]
      }
    }
  });

  const postMap = new Map(posts.map(post => [post.id, post]));
  return ids.map(id => postMap.get(id) || null);
}

// Batch function pour charger les posts par authorId
async function batchPostsByAuthor(authorIds: readonly string[]): Promise<Post[][]> {
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: authorIds as string[]
      }
    }
  });

  // Grouper les posts par authorId
  const postsByAuthor = new Map<string, Post[]>();
  for (const post of posts) {
    const authorPosts = postsByAuthor.get(post.authorId) || [];
    authorPosts.push(post);
    postsByAuthor.set(post.authorId, authorPosts);
  }

  return authorIds.map(authorId => postsByAuthor.get(authorId) || []);
}

// Factory functions
export function createPostLoader() {
  return new DataLoader<string, Post | null>(batchPosts);
}

export function createPostsByAuthorLoader() {
  return new DataLoader<string, Post[]>(batchPostsByAuthor);
}