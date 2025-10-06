export const HomePageTypeDef = `#graphql
  type HomePage {
    title: String!
    latestPosts(limit: Int): [Post!]!
    latestComments(limit: Int): [Comment!]!
  }
`;