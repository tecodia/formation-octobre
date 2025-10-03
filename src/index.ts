import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Step 3 : Architecture refactorisée avec DataSources
// - DataSources pour encapsuler les appels Prisma
// - TypeDefs organisés par type
// - Resolvers organisés par domaine
// - Séparation claire des responsabilités

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
  console.log(`📚 Formation GraphQL - Step 3: Architecture refactorisée avec DataSources`);
  console.log(`\n✨ Architecture :`);
  console.log(`  - DataSources pour encapsuler Prisma`);
  console.log(`  - TypeDefs organisés par domaine`);
  console.log(`  - Resolvers séparés par responsabilité`);
  console.log(`  - Base de données PostgreSQL avec Prisma`);
  console.log(`  - Relations entre entités`);
  console.log(`\n💡 Queries et Mutations à tester :`);
  console.log(`
  query GetPosts {
    posts {
      id
      title
      content
      authorId
    }
  }

  mutation CreateUser {
    createUser(name: "David", email: "david@example.com") {
      id
      name
      email
    }
  }

  mutation CreatePost {
    createPost(
      title: "Mon nouveau post"
      content: "Contenu intéressant..."
      authorId: "1"
    ) {
      id
      title
    }
  }
  `);
}

startServer().catch(err => {
  console.error('Erreur au démarrage du serveur:', err);
});