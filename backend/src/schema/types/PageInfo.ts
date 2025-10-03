// Step 10: Type PageInfo pour la pagination cursor-based

export const PageInfoTypeDef = `#graphql
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;