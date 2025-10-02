import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

// Step 1 : Code organisé en modules
// - typeDefs dans /schema
// - resolvers dans /resolvers
// - données dans /data

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
  console.log(`📚 Formation GraphQL - Step 1: Code modulaire`);
  console.log(`\n✨ Nouveautés de ce step :`);
  console.log(`  - Code organisé en modules`);
  console.log(`  - TypeDefs dans un fichier séparé`);
  console.log(`  - Resolvers organisés par type`);
  console.log(`  - Données mockées externalisées`);
  console.log(`  - Mutations disponibles`);
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