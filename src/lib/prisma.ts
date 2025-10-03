// Step 3: Client Prisma singleton
// Ce pattern garantit qu'on a une seule instance de PrismaClient

import { PrismaClient } from '@prisma/client';

// Déclaration globale pour éviter les instances multiples en développement
declare global {
  var prisma: PrismaClient | undefined;
}

// Création du client Prisma
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// En développement, on stocke l'instance dans global pour éviter
// de créer une nouvelle connexion à chaque hot-reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Fonction pour se déconnecter proprement
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
