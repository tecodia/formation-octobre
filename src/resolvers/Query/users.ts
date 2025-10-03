// Query resolvers pour les Users

import { UserDataSource } from '../../datasources/UserDataSource';

const userDataSource = new UserDataSource();

export const userQueryResolvers = {
  users: async () => {
    return await userDataSource.getAllUsers();
  },

  user: async (_: any, args: { id: string }) => {
    return await userDataSource.getUserById(args.id);
  },
};
