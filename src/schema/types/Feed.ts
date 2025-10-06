export const FeedTypeDef = `#graphql
    union Feed = Article | Video | Tweet

    type Article {
        id: ID!
        title: String!
        content: String!
    }

    type Video {
        id: ID!
        title: String!
        url: String!
    }

    type Tweet {
        id: ID!
        content: String!
        tags: [String!]!
    }
`