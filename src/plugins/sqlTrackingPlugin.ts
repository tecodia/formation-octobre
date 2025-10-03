// Step 4: Plugin Apollo Server pour tracker les requêtes SQL
// Ce plugin ajoute les queries SQL dans les extensions de la réponse GraphQL

import type { ApolloServerPlugin } from '@apollo/server';
import type { GraphQLContext } from '../context';

export const sqlTrackingPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    return {
      async willSendResponse({ response, contextValue }) {
        // Calculer les statistiques
        const queries = contextValue.sqlQueries;
        const totalQueries = queries.length;
        const totalDuration = queries.reduce((sum, q) => sum + q.duration, 0);

        // Ajouter les queries SQL dans les extensions de la réponse
        if (!response.body || response.body.kind !== 'single') {
          return;
        }

        // Initialiser extensions si nécessaire
        if (!response.body.singleResult.extensions) {
          response.body.singleResult.extensions = {};
        }

        // Ajouter les informations SQL
        response.body.singleResult.extensions.sql = {
          queries: queries.map((q) => ({
            query: q.query,
            params: q.params,
            duration: q.duration,
            timestamp: q.timestamp,
          })),
          totalQueries,
          totalDuration: Math.round(totalDuration * 100) / 100, // Arrondi à 2 décimales
        };
      },
    };
  },
};
