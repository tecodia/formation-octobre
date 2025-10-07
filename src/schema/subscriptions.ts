// Step 8: Définition des subscriptions GraphQL

export const SubscriptionsTypeDef = `#graphql
  type Subscription {
    # Écouter l'ajout de nouveaux commentaires
    commentAdded: CommentSubscriptionPayload!

    # Écouter l'ajout de commentaires sur un post spécifique
    commentAddedToPost(postId: ID!): CommentSubscriptionPayload!

    # Écouter la création de nouveaux posts
    postCreated: PostSubscriptionPayload!

    # Écouter les mises à jour de posts
    postUpdated(postId: ID!): PostSubscriptionPayload!

    # Écouter la création de nouveaux utilisateurs
    userCreated: UserSubscriptionPayload!
  }

  # Payload pour les subscriptions de utilisateurs
  type UserSubscriptionPayload {
    user: User!
    action: String!
  }

  # Payload pour les subscriptions de commentaires
  type CommentSubscriptionPayload {
    comment: Comment!
    post: Post!
    action: String!
  }

  # Payload pour les subscriptions de posts
  type PostSubscriptionPayload {
    post: Post!
    action: String!
  }
`;