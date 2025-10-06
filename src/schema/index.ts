// Step 6: Combine tous les typeDefs avec directives

import { UserTypeDef } from './types/User';
import { PostTypeDef } from './types/Post';
import { CommentTypeDef } from './types/Comment';
import { QueriesTypeDef } from './queries';
import { MutationsTypeDef } from './mutations';
import { DirectivesTypeDef } from './directives';
import { FeedTypeDef } from "./types/Feed";
import { NotificationTypeDef } from "./types/Notification";

export const typeDefs = [
  DirectivesTypeDef,
  UserTypeDef,
  PostTypeDef,
  CommentTypeDef,
  QueriesTypeDef,
  MutationsTypeDef,
  FeedTypeDef,
  NotificationTypeDef,
];
