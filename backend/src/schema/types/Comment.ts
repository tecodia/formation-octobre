// Type Comment avec ses relations

export const CommentTypeDef = `#graphql
  type Comment {
    id: ID!
    text: String!
    postId: ID!
    authorId: ID!
    createdAt: String!
    updatedAt: String!
    # Relations
    post: Post!
    author: User!
  }
`;
