// Combine tous les typeDefs

import { UserTypeDef } from './types/User';
import { PostTypeDef } from './types/Post';
import { CommentTypeDef } from './types/Comment';
import { QueriesTypeDef } from './queries';
import { MutationsTypeDef } from './mutations';
import { HomePageTypeDef } from "./types/HomePage";

export const typeDefs = [
  UserTypeDef,
  PostTypeDef,
  CommentTypeDef,
  QueriesTypeDef,
  MutationsTypeDef,
  HomePageTypeDef,
];
