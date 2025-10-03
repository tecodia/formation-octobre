// Step 10: Combine tous les typeDefs avec pagination

import { UserTypeDef } from './types/User';
import { PostTypeDef } from './types/Post';
import { CommentTypeDef } from './types/Comment';
import { ArticlePostTypeDef } from './types/ArticlePost';
import { VideoPostTypeDef } from './types/VideoPost';
import { PollPostTypeDef } from './types/PollPost';
import { ImagePostTypeDef } from './types/ImagePost';
import { FeedTypeDef } from './types/Feed';
import { PageInfoTypeDef } from './types/PageInfo';
import { FeedConnectionTypeDef } from './types/FeedConnection';
import { PostContentUnion } from './unions/PostContent';
import { QueriesTypeDef } from './queries';
import { MutationsTypeDef } from './mutations';
import { SubscriptionsTypeDef } from './subscriptions';
import { DirectivesTypeDef } from './directives';

export const typeDefs = [
  DirectivesTypeDef,
  UserTypeDef,
  PostTypeDef,
  CommentTypeDef,
  ArticlePostTypeDef,
  VideoPostTypeDef,
  PollPostTypeDef,
  ImagePostTypeDef,
  FeedTypeDef,
  PageInfoTypeDef,
  FeedConnectionTypeDef,
  PostContentUnion,
  QueriesTypeDef,
  MutationsTypeDef,
  SubscriptionsTypeDef,
];
