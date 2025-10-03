import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { sqlTrackingPlugin } from './plugins/sqlTrackingPlugin';
import { createContext } from './context';
import { setCurrentContext } from './lib/prisma';
import { redisClient } from './lib/redis';

// Step 6 : Cache Redis + Persisted Queries
// - Cache Redis pour les DataSources
// - Cache HTTP pour les réponses
// - Préparation pour les Persisted Queries
// - Optimisation des performances

// Adaptateur Redis pour le cache Apollo
const cache = new KeyvAdapter(redisClient as any, {
  ttl: 300 * 1000, // 5 minutes en millisecondes
});

// Création du serveur Apollo avec cache et plugins
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    sqlTrackingPlugin,
    responseCachePlugin({
      // Cache basé sur les sessions (optionnel)
      sessionId: (requestContext) => {
        // Pour cache public, retourner null
        // Pour cache privé, retourner un ID de session
        return null;
      },
    }),
  ],
  cache,
  persistedQueries: {
    ttl: 900, // 15 minutes pour les persisted queries
  },
});

// Démarrage du serveur
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
      // Créer un nouveau contexte pour chaque requête
      const context = createContext();
      // Le définir comme contexte actif pour Prisma
      setCurrentContext(context);
      return context;
    },
  });

  console.log(`🚀 Serveur GraphQL démarré sur ${url}`);
  console.log(`📚 Formation GraphQL - Step 6: Cache Redis + Persisted Queries`);
  console.log(`\n✨ Nouvelles fonctionnalités :`);
  console.log(`  - Cache Redis pour les DataSources`);
  console.log(`  - Cache HTTP avec headers Cache-Control`);
  console.log(`  - Support des Persisted Queries`);
  console.log(`  - Invalidation intelligente du cache`);
  console.log(`  - Performance optimale avec cache multi-niveaux`);
  console.log(`\n💡 Exemple de query avec SQL tracking :`);
  console.log(`
  query GetUsersWithPosts {
    users {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
  `);
  console.log(`\n📊 Dans la réponse, regardez "extensions.sql" :`);
  console.log(`  {`);
  console.log(`    "data": { ... },`);
  console.log(`    "extensions": {`);
  console.log(`      "sql": {`);
  console.log(`        "queries": [{ "query": "SELECT ...", "duration": 2.5 }],`);
  console.log(`        "totalQueries": 3,`);
  console.log(`        "totalDuration": 10.2`);
  console.log(`      }`);
  console.log(`    }`);
  console.log(`  }`);
}

startServer().catch(err => {
  console.error('Erreur au démarrage du serveur:', err);
});