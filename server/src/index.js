import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
// import { fieldResolverToCamelCase } from "./utils/fieldResolverToCamelCase";
import { resolvers } from "./resolvers";
import { repos } from "./repos";

const app = express();
app.use(cors());

const server = new ApolloServer({
  resolvers,
  typeDefs: schema,
  // fieldResolver: fieldResolverToCamelCase,
  context: {
    repos
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
