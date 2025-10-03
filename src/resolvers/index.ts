// Step 8: Resolvers avec Subscriptions

import { userQueryResolvers } from './Query/users';
import { postQueryResolvers } from './Query/posts';
import { commentQueryResolvers } from './Query/comments';
import { feedQueryResolvers } from './Query/feed';

import { userMutationResolvers } from './Mutation/userMutations';
import { postMutationResolvers } from './Mutation/postMutations';
import { commentMutationResolvers } from './Mutation/commentMutations';

import { commentSubscriptionResolvers } from './Subscription/commentSubscriptions';
import { postSubscriptionResolvers } from './Subscription/postSubscriptions';

import { userFieldResolvers } from './User';
import { postFieldResolvers } from './Post';
import { commentFieldResolvers } from './Comment';
import { feedFieldResolvers } from './Feed';

import { articlePostFieldResolvers } from './ArticlePost';
import { videoPostFieldResolvers } from './VideoPost';
import { pollPostFieldResolvers } from './PollPost';
import { imagePostFieldResolvers } from './ImagePost';

import { PostContentResolvers } from './PostContent';

export const resolvers = {
  Query: {
    hello: () => 'Hello World! Formation GraphQL Step 8 - Subscriptions temps réel',
    ...userQueryResolvers,
    ...postQueryResolvers,
    ...commentQueryResolvers,
    ...feedQueryResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
    ...postMutationResolvers,
    ...commentMutationResolvers,
  },
  Subscription: {
    ...commentSubscriptionResolvers,
    ...postSubscriptionResolvers,
  },
  // Field resolvers pour les relations
  User: userFieldResolvers,
  Post: postFieldResolvers,
  Comment: commentFieldResolvers,
  ...feedFieldResolvers,
  ...articlePostFieldResolvers,
  ...videoPostFieldResolvers,
  ...pollPostFieldResolvers,
  ...imagePostFieldResolvers,
  // Union resolver
  ...PostContentResolvers,
};
