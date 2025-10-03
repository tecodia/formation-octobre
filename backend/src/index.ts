// Step 8: Serveur Apollo avec Subscriptions WebSocket

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { setCurrentContext } from './lib/prisma';
import { sqlTrackingPlugin } from './plugins/sqlTrackingPlugin';

const PORT = process.env.PORT || 4000;

// Step 8 : Subscriptions temps réel avec WebSocket
// - WebSocket Server pour les subscriptions
// - PubSub pour la communication événementielle
// - Écoute en temps réel des nouveaux commentaires
// - Notifications pour les posts

// Créer le schéma exécutable
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Créer l'application Express et le serveur HTTP
const app = express();
const httpServer = createServer(app);

// Configurer le serveur WebSocket pour les subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Configurer le serveur WebSocket avec graphql-ws
const serverCleanup = useServer(
  {
    schema,
    context: async () => {
      const context = createContext();
      setCurrentContext(context);
      return context;
    },
    onConnect: () => {
      console.log('🔌 Client WebSocket connecté');
    },
    onDisconnect: () => {
      console.log('🔌 Client WebSocket déconnecté');
    },
  },
  wsServer
);

// Créer le serveur Apollo
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },

    // Plugins existants
    sqlTrackingPlugin,
  ],
});

// Fonction principale pour démarrer le serveur
async function startServer() {
  // Démarrer le serveur Apollo
  await server.start();

  // Appliquer le middleware Express
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => {
        const context = createContext();
        setCurrentContext(context);
        return context;
      },
    })
  );

  // Démarrer le serveur HTTP
  httpServer.listen(PORT, () => {
    console.log(`🚀 Serveur GraphQL démarré sur http://localhost:${PORT}/graphql`);
    console.log(`🔌 WebSocket sur ws://localhost:${PORT}/graphql`);
    console.log(`📚 Formation GraphQL - Step 8: Subscriptions temps réel`);
    console.log(`\n✨ Nouvelles fonctionnalités :`);
    console.log(`  - Subscriptions WebSocket pour temps réel`);
    console.log(`  - commentAdded : tous les nouveaux commentaires`);
    console.log(`  - commentAddedToPost : commentaires d'un post spécifique`);
    console.log(`  - postCreated et postUpdated : notifications de posts`);
    console.log(`  - PubSub pour la communication événementielle`);

    console.log(`\n💡 Exemple de subscription pour tester :`);
    console.log(`
subscription WatchComments {
  commentAdded {
    comment {
      id
      text
      createdAt
      author {
        name
      }
    }
    post {
      id
      title
    }
    action
  }
}
    `);

    console.log(`\n📝 Pour tester les subscriptions :`);
    console.log(`  1. Ouvrir Apollo Studio sur http://localhost:${PORT}/graphql`);
    console.log(`  2. Exécuter la subscription ci-dessus`);
    console.log(`  3. Dans un autre onglet, créer un commentaire avec :`);
    console.log(`
mutation AddComment {
  createComment(
    text: "Nouveau commentaire!"
    postId: "REMPLACER_PAR_ID_POST"
    authorId: "REMPLACER_PAR_ID_USER"
  ) {
    id
    text
  }
}
    `);
    console.log(`  4. Observer le commentaire apparaître en temps réel !`);
  });
}

// Démarrer le serveur avec gestion d'erreur
startServer().catch((err) => {
  console.error('❌ Erreur au démarrage du serveur:', err);
  process.exit(1);
});