import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface UserIfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: UserIfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);

      if (args.email) {
        return {
          userError: "User already exist!",
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

      const token = jwt.sign({ userId: newUser.id }, "secret", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },

    signin: async (parent: any, args: UserIfo, context: any) => {
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

      const token = jwt.sign({ userId: user.id }, "secret", {
        expiresIn: "1d",
      });
      return {
        token,
      };
    },
  },
};
