import { pubsub, SUBSCRIPTION_EVENTS } from "../../lib/pubsub";

export const userSubscriptionResolvers = {
  userCreated: {
    subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.USER_CREATED]),
  },
};