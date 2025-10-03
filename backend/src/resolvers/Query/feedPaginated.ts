// Step 10: Resolver pour la pagination cursor-based du feed

import { GraphQLContext } from '../../context';
import { FeedDataSource } from '../../datasources/FeedDataSource';

interface FeedPaginatedArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export async function feedPaginated(
  _parent: unknown,
  args: FeedPaginatedArgs,
  _context: GraphQLContext
) {
  const feedDataSource = new FeedDataSource();

  // Déléguer toute la logique à la DataSource
  return feedDataSource.getFeedPaginated(args);
}