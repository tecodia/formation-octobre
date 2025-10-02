// Step 1: Données mockées dans un fichier séparé

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface Comment {
  id: string;
  text: string;
  postId: string;
  authorId: string;
}

// Données mockées
export const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Introduction à GraphQL',
    content: 'GraphQL est un langage de requête pour API...',
    authorId: '1'
  },
  {
    id: '2',
    title: 'Apollo Server en pratique',
    content: 'Apollo Server est une implémentation populaire...',
    authorId: '2'
  },
  {
    id: '3',
    title: 'Les avantages de GraphQL',
    content: 'GraphQL offre de nombreux avantages...',
    authorId: '1'
  },
];

export const comments: Comment[] = [
  {
    id: '1',
    text: 'Super article !',
    postId: '1',
    authorId: '2'
  },
  {
    id: '2',
    text: 'Très intéressant, merci',
    postId: '1',
    authorId: '3'
  },
  {
    id: '3',
    text: 'J\'ai appris beaucoup de choses',
    postId: '2',
    authorId: '1'
  },
];