// Step 7: Type Feed qui utilise l'union PostContent

export const FeedTypeDef = `#graphql
  type Feed @cacheControl(maxAge: 120) {
    id: ID!
    author: User!
    content: PostContent!
    createdAt: String!
    updatedAt: String!
  }
`;