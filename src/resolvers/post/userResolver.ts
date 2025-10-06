import { users } from "../../data/mockData";

export const userResolver = (parent: any) => {
    return users.find((user) => user.id === parent.authorId);
  }
