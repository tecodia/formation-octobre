// Type User avec ses relations

export const UserTypeDef = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    # Relations
    posts: [Post!]!
    comments: [Comment!]!
  }
`;
