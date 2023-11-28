import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

export interface UserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface IPost {
  title: string;
  content: string;
}
