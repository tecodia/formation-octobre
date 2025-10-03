// Step 5: DataLoader pour optimiser les requêtes User
import DataLoader from 'dataloader';
import { prisma } from '../lib/prisma';
import type { User } from '@prisma/client';

// Batch function pour charger plusieurs users par IDs
async function batchUsers(ids: readonly string[]): Promise<(User | null)[]> {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids as string[]
      }
    }
  });

  // Map pour retourner dans le même ordre que les IDs demandés
  const userMap = new Map(users.map(user => [user.id, user]));
  return ids.map(id => userMap.get(id) || null);
}

// Factory function pour créer un nouveau loader par requête
export function createUserLoader() {
  return new DataLoader<string, User | null>(batchUsers);
}