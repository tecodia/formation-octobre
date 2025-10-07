// Mutation resolvers pour les Users

import { UserDataSource } from '../../datasources/UserDataSource';
import { pubsub, SUBSCRIPTION_EVENTS } from "../../lib/pubsub";

const userDataSource = new UserDataSource();

export const userMutationResolvers = {
  createUser: async (_: any, args: { name: string; email: string }) => {

    const newUser = await userDataSource.createUser(args.name, args.email);

    await pubsub.publish(SUBSCRIPTION_EVENTS.USER_CREATED, {
      userCreated: {
        user: newUser,
        action: "CREATED",
      },
    });

    return newUser;
  },

  updateUser: async (_: any, args: { id: string; name?: string; email?: string }) => {
    return await userDataSource.updateUser(args.id, args.name, args.email);
  },
};
