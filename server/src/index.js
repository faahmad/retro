import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";

const app = express();
app.use(cors());

const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
