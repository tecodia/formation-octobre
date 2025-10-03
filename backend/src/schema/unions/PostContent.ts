// Step 7: Union PostContent pour différents types de posts

export const PostContentUnion = `#graphql
  # Union pour représenter différents types de contenus de posts
  union PostContent = ArticlePost | VideoPost | PollPost | ImagePost
`;