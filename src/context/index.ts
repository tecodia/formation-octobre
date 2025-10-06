// Step 4: Contexte GraphQL avec tracking SQL
// Ce contexte est partagé entre tous les resolvers d'une requête

import { createLoaders } from "../loaders";

export interface SQLQuery {
  query: string;
  params: string;
  duration: number;
  timestamp: number;
}

export interface GraphQLContext {
  sqlQueries: SQLQuery[];
  loaders: ReturnType<typeof createLoaders>;
}

export function createContext(): GraphQLContext {
  return {
    sqlQueries: [],
    loaders: createLoaders(),
  };
}
