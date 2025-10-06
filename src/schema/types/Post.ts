// Type Post avec ses relations

export const PostTypeDef = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    # Relations
    author: User!
    comments: [Comment!]!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  input UpdatePostInput {
    id: ID!
    title: String
    content: String
  }
`;
