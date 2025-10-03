// Step 7: Script de seed avec différents types de posts pour les unions

import { PrismaClient, PostType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed Step 7...');

  // Nettoyage des données existantes
  console.log('🧹 Nettoyage des données existantes...');
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Création des utilisateurs
  console.log('👥 Création des utilisateurs...');
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@example.com',
    },
  });

  console.log(`✅ Créé ${alice.name}, ${bob.name}, ${charlie.name}`);

  // Step 7: Création des posts avec différents types
  console.log('📝 Création des posts avec types variés...');

  // Article Post
  const post1 = await prisma.post.create({
    data: {
      title: 'Introduction à GraphQL',
      content: 'GraphQL est un langage de requête pour les APIs qui permet aux clients de demander exactement ce dont ils ont besoin. Contrairement à REST, GraphQL offre un point d\'entrée unique et une structure de données flexible. Cette approche révolutionnaire a été développée par Facebook et est maintenant utilisée par de nombreuses entreprises.',
      type: PostType.ARTICLE,
      metadata: {
        tags: ['GraphQL', 'API', 'Tutorial', 'Backend'],
        readingTime: 5,
      },
      authorId: alice.id,
    },
  });

  // Video Post
  const post2 = await prisma.post.create({
    data: {
      title: 'Apollo Server en 10 minutes',
      content: 'Découvrez Apollo Server en vidéo',
      type: PostType.VIDEO,
      metadata: {
        videoUrl: 'https://youtube.com/watch?v=example',
        duration: 600,
        thumbnail: 'https://img.youtube.com/vi/example/maxresdefault.jpg',
        description: 'Une introduction rapide à Apollo Server et ses fonctionnalités principales',
        views: 1250,
      },
      authorId: bob.id,
    },
  });

  // Poll Post
  const post3 = await prisma.post.create({
    data: {
      title: 'Quel ORM préférez-vous avec GraphQL?',
      content: 'Participez à notre sondage',
      type: PostType.POLL,
      metadata: {
        options: [
          { id: '1', text: 'Prisma', votes: 42 },
          { id: '2', text: 'TypeORM', votes: 28 },
          { id: '3', text: 'Sequelize', votes: 15 },
          { id: '4', text: 'MikroORM', votes: 8 },
        ],
        multipleChoice: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      authorId: alice.id,
    },
  });

  // Image Post
  const post4 = await prisma.post.create({
    data: {
      title: 'Architecture GraphQL illustrée',
      content: 'Visualisation de l\'architecture GraphQL',
      type: PostType.IMAGE,
      metadata: {
        images: [
          {
            url: 'https://example.com/graphql-architecture.png',
            caption: 'Vue d\'ensemble de l\'architecture GraphQL',
            altText: 'Diagramme montrant client, serveur GraphQL et sources de données',
          },
          {
            url: 'https://example.com/apollo-server.png',
            caption: 'Apollo Server dans l\'écosystème',
            altText: 'Schéma Apollo Server avec ses plugins et datasources',
          },
        ],
        description: 'Une série de diagrammes pour comprendre l\'architecture GraphQL moderne',
      },
      authorId: charlie.id,
    },
  });

  // Un autre Article Post
  const post5 = await prisma.post.create({
    data: {
      title: 'Les Unions dans GraphQL',
      content: 'Les unions permettent de retourner différents types d\'objets depuis un même champ. C\'est particulièrement utile pour les feeds polymorphes comme sur les réseaux sociaux où différents types de contenus peuvent être mélangés.',
      type: PostType.ARTICLE,
      metadata: {
        tags: ['GraphQL', 'Unions', 'Advanced'],
        readingTime: 8,
      },
      authorId: bob.id,
    },
  });

  // Un autre Video Post
  const post6 = await prisma.post.create({
    data: {
      title: 'DataLoader expliqué',
      content: 'Comprendre DataLoader et le problème N+1',
      type: PostType.VIDEO,
      metadata: {
        videoUrl: 'https://youtube.com/watch?v=dataloader',
        duration: 900,
        thumbnail: 'https://img.youtube.com/vi/dataloader/maxresdefault.jpg',
        description: 'DataLoader résout le problème N+1 en batchant et cachant les requêtes',
        views: 890,
      },
      authorId: charlie.id,
    },
  });

  console.log('✅ Créé 6 posts de différents types');

  // Création de commentaires sur les différents types de posts
  console.log('💬 Création des commentaires...');

  await prisma.comment.create({
    data: {
      text: 'Excellent article sur GraphQL !',
      postId: post1.id,
      authorId: bob.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'La vidéo est très claire, merci !',
      postId: post2.id,
      authorId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'J\'ai voté pour Prisma, c\'est vraiment le meilleur ORM !',
      postId: post3.id,
      authorId: charlie.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Les diagrammes sont très utiles pour comprendre.',
      postId: post4.id,
      authorId: bob.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Les unions sont un concept puissant !',
      postId: post5.id,
      authorId: alice.id,
    },
  });

  console.log('✅ Créé 5 commentaires');

  // Affichage des statistiques
  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count();
  const commentCount = await prisma.comment.count();

  const postsByType = await prisma.post.groupBy({
    by: ['type'],
    _count: true,
  });

  console.log('\n📊 Statistiques de la base de données :');
  console.log(`   👥 Utilisateurs : ${userCount}`);
  console.log(`   📝 Posts total : ${postCount}`);
  console.log('\n   📈 Posts par type :');
  postsByType.forEach((type) => {
    console.log(`      - ${type.type} : ${type._count}`);
  });
  console.log(`   💬 Commentaires : ${commentCount}`);
  console.log('\n✨ Seed Step 7 terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });