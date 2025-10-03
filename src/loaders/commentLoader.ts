// Step 5: DataLoader pour optimiser les requêtes Comment
import DataLoader from 'dataloader';
import { prisma } from '../lib/prisma';
import type { Comment } from '@prisma/client';

// Batch function pour charger les commentaires par postIds
async function batchCommentsByPost(postIds: readonly string[]): Promise<Comment[][]> {
  const comments = await prisma.comment.findMany({
    where: {
      postId: {
        in: postIds as string[]
      }
    }
  });

  // Grouper les commentaires par postId
  const commentsByPost = new Map<string, Comment[]>();
  for (const comment of comments) {
    const postComments = commentsByPost.get(comment.postId) || [];
    postComments.push(comment);
    commentsByPost.set(comment.postId, postComments);
  }

  return postIds.map(postId => commentsByPost.get(postId) || []);
}

// Batch function pour charger les commentaires par authorIds
async function batchCommentsByAuthor(authorIds: readonly string[]): Promise<Comment[][]> {
  const comments = await prisma.comment.findMany({
    where: {
      authorId: {
        in: authorIds as string[]
      }
    }
  });

  // Grouper les commentaires par authorId
  const commentsByAuthor = new Map<string, Comment[]>();
  for (const comment of comments) {
    const authorComments = commentsByAuthor.get(comment.authorId) || [];
    authorComments.push(comment);
    commentsByAuthor.set(comment.authorId, authorComments);
  }

  return authorIds.map(authorId => commentsByAuthor.get(authorId) || []);
}

// Factory functions
export function createCommentsByPostLoader() {
  return new DataLoader<string, Comment[]>(batchCommentsByPost);
}

export function createCommentsByAuthorLoader() {
  return new DataLoader<string, Comment[]>(batchCommentsByAuthor);
}