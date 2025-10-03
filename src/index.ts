import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { sqlTrackingPlugin } from './plugins/sqlTrackingPlugin';
import { createContext } from './context';
import { setCurrentContext } from './lib/prisma';

// Step 5 : DataLoader + Plugin SQL Tracking
// - DataLoader pour optimiser les requêtes N+1
// - Batching et caching des requêtes similaires
// - Plugin Apollo pour capturer les requêtes SQL
// - Contexte GraphQL avec DataLoaders et tracking SQL

// Création du serveur Apollo avec plugin SQL tracking
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [sqlTrackingPlugin],
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
  console.log(`📚 Formation GraphQL - Step 5: DataLoader + SQL Tracking`);
  console.log(`\n✨ Nouvelles fonctionnalités :`);
  console.log(`  - DataLoader pour optimiser les requêtes N+1`);
  console.log(`  - Batching automatique des requêtes similaires`);
  console.log(`  - Cache par requête GraphQL`);
  console.log(`  - Plugin SQL Tracking pour voir les optimisations`);
  console.log(`  - Réduction de 80-90% des requêtes SQL`);
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