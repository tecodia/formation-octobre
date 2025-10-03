import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers/index.prisma';
import { prisma, disconnectPrisma } from './lib/prisma';

// Step 3 : Intégration PostgreSQL + Prisma
// - Docker Compose avec PostgreSQL et Adminer
// - Prisma ORM pour la base de données
// - Migrations et seed
// - Resolvers connectés à la base de données

// Création du serveur Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Démarrage du serveur
async function startServer() {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log('✅ Connexion à PostgreSQL établie');

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`\n🚀 Serveur GraphQL démarré sur ${url}`);
    console.log(`📚 Formation GraphQL - Step 3: PostgreSQL + Prisma\n`);
    console.log(`✨ Nouveautés de ce step :`);
    console.log(`  - PostgreSQL via Docker Compose`);
    console.log(`  - Adminer sur http://localhost:8080`);
    console.log(`  - Prisma ORM avec schéma type-safe`);
    console.log(`  - Migrations de base de données`);
    console.log(`  - Seed data automatique`);
    console.log(`  - Resolvers connectés à PostgreSQL\n`);

    console.log(`💡 Exemples de queries à tester :`);
    console.log(`
  # Récupérer tous les utilisateurs avec leurs posts
  query GetUsersWithPosts {
    users {
      id
      name
      email
      posts {
        id
        title
        content
      }
    }
  }

  # Récupérer un post avec son auteur et commentaires
  query GetPostDetails {
    posts {
      id
      title
      content
      author {
        name
        email
      }
      comments {
        text
        author {
          name
        }
      }
    }
  }

  # Créer un nouvel utilisateur
  mutation CreateUser {
    createUser(name: "David", email: "david@example.com") {
      id
      name
      email
    }
  }

  # Créer un post
  mutation CreatePost {
    createPost(
      title: "Mon nouveau post avec Prisma"
      content: "Prisma rend le travail avec PostgreSQL très agréable!"
      authorId: "REMPLACER_PAR_UN_ID_UTILISATEUR"
    ) {
      id
      title
      author {
        name
      }
    }
  }

  # Créer un commentaire
  mutation CreateComment {
    createComment(
      text: "Super article!"
      postId: "REMPLACER_PAR_UN_ID_POST"
      authorId: "REMPLACER_PAR_UN_ID_UTILISATEUR"
    ) {
      id
      text
      author {
        name
      }
    }
  }
    `);

    // Gestion de l'arrêt propre
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Arrêt du serveur...');
      await disconnectPrisma();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 Arrêt du serveur...');
      await disconnectPrisma();
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err);
    console.error('\n💡 Assurez-vous que Docker est lancé et que la base de données est démarrée:');
    console.error('   docker-compose up -d');
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error('❌ Erreur au démarrage du serveur:', err);
  process.exit(1);
});
