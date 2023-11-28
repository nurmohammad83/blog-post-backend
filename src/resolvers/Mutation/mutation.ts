import bcrypt from "bcrypt";
import { Context, IPost, UserInfo } from "../../interfaces/interfaces";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../config";

export const Mutation = {
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

  addPost: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    if (!args.title || !args.content) {
      return {
        userError: "Title and content is required!",
        post: null,
      };
    }
    const newPost = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: userInfo.userId,
      },
    });

    return {
      userError: null,
      post: newPost,
    };
  },
};
