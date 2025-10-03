// Step 7: Type ImagePost pour les galeries d'images

export const ImagePostTypeDef = `#graphql
  type ImageItem {
    url: String!
    caption: String
    altText: String
  }

  type ImagePost @cacheControl(maxAge: 300) {
    id: ID!
    title: String!
    images: [ImageItem!]!
    description: String
    authorId: ID!
    author: User!
    createdAt: String!
    comments: [Comment!]!
  }
`;