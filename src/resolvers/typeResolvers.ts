// Step 2: Field resolvers pour les relations

import { users, posts, comments } from '../data/mockData';

// Field resolvers pour User
export const userResolvers = {
  posts: (parent: { id: string }) => {
    // Trouve tous les posts de cet auteur
    return posts.filter(post => post.authorId === parent.id);
  },
  comments: (parent: { id: string }) => {
    // Trouve tous les commentaires de cet auteur
    return comments.filter(comment => comment.authorId === parent.id);
  },
};

// Field resolvers pour Post
export const postResolvers = {
  author: (parent: { authorId: string }) => {
    // Trouve l'auteur du post
    return users.find(user => user.id === parent.authorId);
  },
  comments: (parent: { id: string }) => {
    // Trouve tous les commentaires du post
    return comments.filter(comment => comment.postId === parent.id);
  },
};

// Field resolvers pour Comment
export const commentResolvers = {
  post: (parent: { postId: string }) => {
    // Trouve le post du commentaire
    return posts.find(post => post.id === parent.postId);
  },
  author: (parent: { authorId: string }) => {
    // Trouve l'auteur du commentaire
    return users.find(user => user.id === parent.authorId);
  },
};