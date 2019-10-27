import "dotenv-flow/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import { models, sequelize } from "./models";

const app = express();
app.use(cors());

export const server = new ApolloServer({
  resolvers,
  typeDefs: schema,
  context: {
    models
  }
});

server.applyMiddleware({ app, path: "/graphql" });

sequelize.sync().then(async () => {
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});
