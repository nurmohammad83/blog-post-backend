export const Query = {
  users: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findMany();
  },
  profile: async (parent: any, { id }: number | any, { prisma }: any) => {
    return await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  },
};
