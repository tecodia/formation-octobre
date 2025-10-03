// Mutation resolvers pour les Users

import { UserDataSource } from '../../datasources/UserDataSource';

const userDataSource = new UserDataSource();

export const userMutationResolvers = {
  createUser: async (_: any, args: { name: string; email: string }) => {
    return await userDataSource.createUser(args.name, args.email);
  },

  updateUser: async (_: any, args: { id: string; name?: string; email?: string }) => {
    return await userDataSource.updateUser(args.id, args.name, args.email);
  },
};
