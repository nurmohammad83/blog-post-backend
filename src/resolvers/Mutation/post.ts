import { Context, IPost } from "../../interfaces/interfaces";
import { checkUserAccess } from "../../utils/checkUser";

export const postResolver = {
  addPost: async (
    parent: any,
    { post }: { post: IPost },
    { prisma, userInfo }: Context
  ) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    if (!post.title || !post.content) {
      return {
        userError: "Title and content is required!",
        post: null,
      };
    }
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });

    return {
      userError: null,
      post: newPost,
    };
  },

  updatePost: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }

    const errorAccrue = await checkUserAccess(
      prisma,
      userInfo.userId,
      args.postId
    );

    if (errorAccrue) {
      return errorAccrue;
    }
    const updatePost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post,
    });

    return {
      userError: null,
      post: updatePost,
    };
  },

  deletePost: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }

    const errorAccrue = await checkUserAccess(
      prisma,
      userInfo.userId,
      args.postId
    );

    if (errorAccrue) {
      return errorAccrue;
    }
    const deletePost = await prisma.post.delete({
      where: {
        id: Number(args.postId),
      },
    });

    return {
      userError: null,
      post: deletePost,
    };
  },

  publishPost: async (
    parent: any,
    args: any,
    { prisma, userInfo }: Context
  ) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }

    const errorAccrue = await checkUserAccess(
      prisma,
      userInfo.userId,
      args.postId
    );

    if (errorAccrue) {
      return errorAccrue;
    }

    const existPost = await prisma.post.findUnique({
      where: {
        id: Number(args.postId),
      },
    });

    if (existPost?.published === true) {
      return {
        userError: "This post already published",
        post: null,
      };
    }
    const updatePost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: {
        published: true,
      },
    });

    return {
      userError: null,
      post: updatePost,
    };
  },
};
