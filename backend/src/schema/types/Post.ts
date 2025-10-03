// Type Post avec ses relations

export const PostTypeDef = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    createdAt: String!
    updatedAt: String!
    # Relations
    author: User!
    comments: [Comment!]!
  }
`;
