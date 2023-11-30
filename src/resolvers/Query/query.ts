import { Context } from "../../interfaces/interfaces";

export const Query = {
  user: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    return await prisma.user.findUnique({
      where: {
        id: userInfo?.userId,
      },
    });
  },
  users: async (parent: any, args: any, { prisma }: Context) => {
    return await prisma.user.findMany();
  },
  posts: async (parent: any, args: any, { prisma }: Context) => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
  profile: async (parent: any, args: any, { prisma }: Context) => {
    return await prisma.profile.findUnique({
      where: {
        userId: Number(args.userId),
      },
    });
  },
};
