export const notificationQueryResolvers = {
  notifications: async () => {
    return [
      {
        id: "1",
        message: "Notification 1",
        email: "test@test.com",
        __typename: "EmailNotification"
      },
      {
        id: "2",
        message: "Notification 2",
        phone: "1234567890",
        __typename: "SmsNotification"
      },
      {
        id: "3",
        message: "Notification 3",
        deviceToken: "1234567890",
        __typename: "PushNotification"
      },
    ];
  },
};