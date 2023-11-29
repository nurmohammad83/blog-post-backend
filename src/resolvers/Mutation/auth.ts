import bcrypt from "bcrypt";
import { Context, UserInfo } from "../../interfaces/interfaces";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../config";

export const authResolver = {
  signup: async (parent: any, args: UserInfo, { prisma }: Context) => {
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

    const token = await jwtHelper.generateToken(
      { userId: newUser.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },

  signin: async (parent: any, args: UserInfo, { prisma }: Context) => {
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

    const token = await jwtHelper.generateToken(
      { userId: user.id },
      config.jwt.secret as string
    );
    return {
      token,
    };
  },
};
