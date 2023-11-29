import { Context } from "../interfaces/interfaces";

export const Profile = {
  user: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    return await prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};
