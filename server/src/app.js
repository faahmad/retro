import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import models from "./models";

const app = express();
app.use(cors());

const apolloServer = new ApolloServer({
  resolvers,
  typeDefs: schema,
  context: {
    models
  },
  playground: true
});
apolloServer.applyMiddleware({ app, path: "/graphql" });

export default app;
