import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { AuthenticationService } from "./services/authentication-service";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import models from "./models";

const app = express();
app.use(cors());

const apolloServer = new ApolloServer({
  resolvers,
  typeDefs: schema,
  context: async ({ req }) => {
    const idToken = req.headers["x-retro-auth"];
    const userId = await AuthenticationService.getUserIdFromIdToken(idToken);

    console.log("userId", userId);

    return {
      models,
      userId
    };
  }
});
apolloServer.applyMiddleware({ app, path: "/graphql" });

export default app;
