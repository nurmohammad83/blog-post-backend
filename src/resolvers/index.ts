import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../utils/jwtHelper";
import config from "../config";
import { UserInfo } from "../interfaces/interfaces";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
    profile: async (parent: any, { id }: number | any, context: any) => {
      return await prisma.user.findFirst({
        where: {
          id: id,
        },
      });
    },
  },
  Mutation: {
    signup: async (parent: any, args: UserInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);

      const isExistUser = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (isExistUser) {
        return {
          userError: "Already this email is register!",
          token: null,
        };
      }
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: newUser.id,
          },
        });
      }

      const token = await jwtHelper(
        { userId: newUser.id },
        config.jwt.secret as string
      );
      return {
        userError: null,
        token,
      };
    },

    signin: async (parent: any, args: UserInfo, context: any) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (!user) {
        return {
          userError: "User does not exist!",
          token: null,
        };
      }
      const validPass = await bcrypt.compare(args.password, user.password);
      if (!validPass) {
        return {
          userError: "Incorrect Password",
          token: null,
        };
      }

      const token = await jwtHelper(
        { userId: user.id },
        config.jwt.secret as string
      );
      return {
        token,
      };
    },
    createPost: async (parent: any, args: any, context: any) => {
      await prisma.post.create({ data: args });
    },
  },
};
