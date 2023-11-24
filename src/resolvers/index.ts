import { PrismaClient } from "@prisma/client";
import { Query } from "./Query/query";
import { Mutation } from "./Mutation/mutation";

const prisma = new PrismaClient();

export const resolvers = {
  Query,
  Mutation,
};
