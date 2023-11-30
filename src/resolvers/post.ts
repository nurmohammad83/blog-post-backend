import { userLoader } from "../dataLoader/userLoader";
import { Context } from "../interfaces/interfaces";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    return userLoader.load(parent.authorId);
  },
};
