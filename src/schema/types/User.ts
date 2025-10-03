// Step 6: Type User avec cache control

export const UserTypeDef = `#graphql
  type User @cacheControl(maxAge: 300) {
    id: ID!
    name: String!
    email: String!
    # Relations - Cache plus court car dynamique
    posts: [Post!]! @cacheControl(maxAge: 60)
    comments: [Comment!]! @cacheControl(maxAge: 60)
  }
`;
