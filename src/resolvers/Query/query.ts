import { Context } from "../../interfaces/interfaces";

export const Query = {
  users: async (parent: any, args: any, { prisma }: Context) => {
    return await prisma.user.findMany();
  },
  posts: async (parent: any, args: any, { prisma }: Context) => {
    return await prisma.post.findMany();
  },
  profile: async (parent: any, { id }: number | any, { prisma }: Context) => {
    return await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  },
};
