// Définition de toutes les mutations disponibles

export const MutationsTypeDef = `#graphql
  type Mutation {
    # Users
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User

    # Posts
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, title: String, content: String): Post

    # Comments
    createComment(text: String!, postId: ID!, authorId: ID!): Comment!
  }
`;
