// Step 7: Type ArticlePost pour les articles classiques

export const ArticlePostTypeDef = `#graphql
  type ArticlePost @cacheControl(maxAge: 300) {
    id: ID!
    title: String!
    content: String!
    readingTime: Int! # En minutes
    tags: [String!]!
    authorId: ID!
    author: User!
    createdAt: String!
    comments: [Comment!]!
  }
`;