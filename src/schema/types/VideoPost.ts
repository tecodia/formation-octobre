// Step 7: Type VideoPost pour les contenus vidéo

export const VideoPostTypeDef = `#graphql
  type VideoPost @cacheControl(maxAge: 300) {
    id: ID!
    title: String!
    videoUrl: String!
    duration: Int! # En secondes
    thumbnail: String
    description: String
    views: Int!
    authorId: ID!
    author: User!
    createdAt: String!
    comments: [Comment!]!
  }
`;