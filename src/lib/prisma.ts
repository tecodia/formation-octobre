// Step 4: Client Prisma singleton avec tracking SQL
// Ce pattern garantit qu'on a une seule instance de PrismaClient
// et permet de capturer les queries SQL pour le debugging

import { PrismaClient } from '@prisma/client';
import type { GraphQLContext } from '../context';

// Types pour les événements Prisma
interface PrismaQueryEvent {
  query: string;
  params: string;
  duration: number;
  target: string;
}

// Extension du type PrismaClient pour inclure le logging
type PrismaClientWithLogging = PrismaClient & {
  $on(event: 'query', callback: (e: PrismaQueryEvent) => void): void;
};

// Déclaration globale pour éviter les instances multiples en développement
declare global {
  var prisma: PrismaClientWithLogging | undefined;
}

// Variable pour stocker le contexte GraphQL courant
// Utilise AsyncLocalStorage pattern pour isoler par requête
let currentContext: GraphQLContext | null = null;

// Création du client Prisma avec logging des queries
export const prisma = (global.prisma || new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
})) as PrismaClientWithLogging;

// Écouter les événements de query Prisma
prisma.$on('query', (e: PrismaQueryEvent) => {
  // Si on a un contexte actif, enregistrer la query
  if (currentContext) {
    currentContext.sqlQueries.push({
      query: e.query,
      params: e.params,
      duration: e.duration,
      timestamp: Date.now(),
    });
  }
});

// En développement, on stocke l'instance dans global pour éviter
// de créer une nouvelle connexion à chaque hot-reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Fonction pour définir le contexte courant
export function setCurrentContext(context: GraphQLContext | null) {
  currentContext = context;
}

// Fonction pour obtenir le contexte courant
export function getCurrentContext() {
  return currentContext;
}

// Fonction pour se déconnecter proprement
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
