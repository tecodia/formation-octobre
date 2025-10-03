// Step 8: Mutation resolvers pour les Comments avec subscriptions

import { CommentDataSource } from '../../datasources/CommentDataSource';
import { PostDataSource } from '../../datasources/PostDataSource';
import { pubsub, SUBSCRIPTION_EVENTS } from '../../lib/pubsub';

const commentDataSource = new CommentDataSource();
const postDataSource = new PostDataSource();

export const commentMutationResolvers = {
  createComment: async (_: any, args: { text: string; postId: string; authorId: string }) => {
    // Créer le commentaire
    const comment = await commentDataSource.createComment(args.text, args.postId, args.authorId);

    // Récupérer le post associé pour le payload
    const post = await postDataSource.getPostById(args.postId);

    // Publier l'événement pour les subscriptions
    await pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_ADDED, {
      commentAdded: {
        comment,
        post,
        action: 'CREATED'
      },
      commentAddedToPost: {
        comment,
        post,
        action: 'CREATED'
      }
    });

    return comment;
  },
};
