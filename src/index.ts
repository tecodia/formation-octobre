import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Step 0 : Apollo Server basique avec un type et une query simple
// Tout dans un seul fichier pour commencer

// Définition du schéma GraphQL
const typeDefs = `#graphql
  # Type User basique pour commencer
  type User {
    id: ID!
    name: String!
    email: String!
  }

  # Type Post pour notre blog
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
  }

  # Queries disponibles
  type Query {
    # Query de test
    hello: String!

    # Récupérer tous les users
    users: [User!]!

    # Récupérer un user par ID
    user(id: ID!): User
  }
`;

// Données mockées en mémoire (pas de DB pour le moment)
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
];

// Resolvers : logique pour répondre aux queries
const resolvers = {
  Query: {
    hello: () => 'Hello World! Bienvenue dans la formation GraphQL 🚀',

    users: () => users,

    user: (_: any, args: { id: string }) => {
      return users.find(user => user.id === args.id);
    },
  },
};

// Création du serveur Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Démarrage du serveur
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Serveur GraphQL démarré sur ${url}`);
  console.log(`📚 Formation GraphQL - Step 0: Monofichier basique`);
  console.log(`\n💡 Essayez ces queries dans Apollo Studio :`);
  console.log(`
  query Hello {
    hello
  }

  query GetUsers {
    users {
      id
      name
      email
    }
  }

  query GetUser {
    user(id: "1") {
      name
      email
    }
  }
  `);
}

startServer().catch(err => {
  console.error('Erreur au démarrage du serveur:', err);
});