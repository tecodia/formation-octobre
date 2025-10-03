// Step 7: Type PollPost pour les sondages

export const PollPostTypeDef = `#graphql
  type PollOption {
    id: String!
    text: String!
    votes: Int!
  }

  type PollPost @cacheControl(maxAge: 60) {
    id: ID!
    question: String!
    options: [PollOption!]!
    totalVotes: Int!
    multipleChoice: Boolean!
    expiresAt: String
    authorId: ID!
    author: User!
    createdAt: String!
    comments: [Comment!]!
  }
`;