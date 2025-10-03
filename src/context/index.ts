// Step 5: Contexte GraphQL avec tracking SQL et DataLoaders
// Ce contexte est partagé entre tous les resolvers d'une requête

import { createLoaders, type DataLoaders } from '../loaders';

export interface SQLQuery {
  query: string;
  params: string;
  duration: number;
  timestamp: number;
}

export interface GraphQLContext {
  sqlQueries: SQLQuery[];
  loaders: DataLoaders;
}

export function createContext(): GraphQLContext {
  return {
    sqlQueries: [],
    loaders: createLoaders()
  };
}
