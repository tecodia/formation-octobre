export const NotificationTypeDef = `#graphql
    interface Notification {
        id: ID!
        message: String!
    }

    type EmailNotification implements Notification {
        id: ID!
        message: String!
        email: String!
    }

    type SmsNotification implements Notification {
        id: ID!
        message: String!
        phone: String!
    }

    type PushNotification implements Notification {
        id: ID!
        message: String!
        deviceToken: String!
    }
`