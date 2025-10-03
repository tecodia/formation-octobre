// Step 7: Resolver pour l'union PostContent

export const PostContentResolvers = {
  PostContent: {
    __resolveType(obj: any) {
      // Déterminer le type concret basé sur le champ type de la base de données
      switch (obj.type) {
        case 'ARTICLE':
          return 'ArticlePost';
        case 'VIDEO':
          return 'VideoPost';
        case 'POLL':
          return 'PollPost';
        case 'IMAGE':
          return 'ImagePost';
        default:
          return 'ArticlePost'; // Type par défaut
      }
    },
  },
};