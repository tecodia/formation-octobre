// Step 3: Script de seed pour initialiser la base de données

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

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

  // Création des posts
  console.log('📝 Création des posts...');
  const post1 = await prisma.post.create({
    data: {
      title: 'Introduction à GraphQL',
      content: 'GraphQL est un langage de requête pour API qui permet aux clients de demander exactement les données dont ils ont besoin. Développé par Facebook, il offre une alternative flexible et puissante aux API REST traditionnelles.',
      authorId: alice.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Apollo Server en pratique',
      content: 'Apollo Server est une implémentation populaire de GraphQL pour Node.js. Il simplifie la création d\'APIs GraphQL robustes et évolutives avec de nombreuses fonctionnalités intégrées comme la validation, le caching et les plugins.',
      authorId: bob.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Les avantages de GraphQL',
      content: 'GraphQL offre de nombreux avantages : récupération précise des données, schéma fortement typé, introspection, documentation auto-générée, et une excellente expérience développeur. C\'est un outil puissant pour construire des APIs modernes.',
      authorId: alice.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Prisma et les bases de données',
      content: 'Prisma est un ORM moderne pour Node.js et TypeScript qui simplifie l\'accès aux bases de données. Il offre un excellent support pour PostgreSQL, MySQL, SQLite et d\'autres bases de données avec un schéma type-safe.',
      authorId: charlie.id,
    },
  });

  console.log(`✅ Créé ${post1.title}, ${post2.title}, ${post3.title}, ${post4.title}`);

  // Création des commentaires
  console.log('💬 Création des commentaires...');
  await prisma.comment.create({
    data: {
      text: 'Super article ! J\'ai beaucoup appris sur GraphQL.',
      postId: post1.id,
      authorId: bob.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Très intéressant, merci pour le partage !',
      postId: post1.id,
      authorId: charlie.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'J\'ai appris beaucoup de choses sur Apollo Server.',
      postId: post2.id,
      authorId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Excellent tutoriel, très clair et bien expliqué.',
      postId: post2.id,
      authorId: charlie.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'GraphQL a vraiment changé ma façon de développer des APIs !',
      postId: post3.id,
      authorId: bob.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Prisma est vraiment génial avec TypeScript !',
      postId: post4.id,
      authorId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Merci pour cette introduction à Prisma.',
      postId: post4.id,
      authorId: bob.id,
    },
  });

  console.log('✅ Créé 7 commentaires');

  // Affichage des statistiques
  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count();
  const commentCount = await prisma.comment.count();

  console.log('\n📊 Statistiques de la base de données :');
  console.log(`   👥 Utilisateurs : ${userCount}`);
  console.log(`   📝 Posts : ${postCount}`);
  console.log(`   💬 Commentaires : ${commentCount}`);
  console.log('\n✨ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
