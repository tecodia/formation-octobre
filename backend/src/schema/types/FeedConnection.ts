// Step 10: Types pour la pagination cursor-based du Feed

export const FeedConnectionTypeDef = `#graphql
  type FeedEdge {
    cursor: String!
    node: Feed!
  }

  type FeedConnection {
    edges: [FeedEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }
`;