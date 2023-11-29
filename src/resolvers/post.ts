import { Context } from "../interfaces/interfaces";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    return await prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
