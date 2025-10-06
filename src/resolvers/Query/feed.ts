export const feedQueryResolvers = {
  feed: async () => {
    return [
        {
            title: "Article 1",
            content: "Content of Article 1",
            __typename: "Video"
        },
        {
            title: "Video 1",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            __typename: "Video"
        },
        {
            content: "Content of Tweet 1",
            tags: ["#twitter", "#graphql"],
            __typename: "Tweet"
        }
    ]
  },
};