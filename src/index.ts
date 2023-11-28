import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { PrismaClient } from "@prisma/client";
import { Context } from "./interfaces/interfaces";
import { jwtHelper } from "./utils/jwtHelper";
import config from "./config";

const prisma = new PrismaClient();

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<Context> => {
      const deoced = await jwtHelper.verifyToken(
        req.headers.authorization as string,
        config.jwt.secret as string
      );
      return {
        prisma,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};
main();
