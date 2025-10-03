// Step 4: Contexte GraphQL avec tracking SQL
// Ce contexte est partagé entre tous les resolvers d'une requête

export interface SQLQuery {
  query: string;
  params: string;
  duration: number;
  timestamp: number;
}

export interface GraphQLContext {
  sqlQueries: SQLQuery[];
}

export function createContext(): GraphQLContext {
  return {
    sqlQueries: [],
  };
}
