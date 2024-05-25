import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createYoga } from "graphql-yoga";
import { createJsonDataLoaders, createPostgresLoaders, getResolvers } from "./resolvers";
import { typeDefinitions } from "./schema";

const app = express();
const PORT = 3000;

const loaders = createJsonDataLoaders();
const executableSchema = makeExecutableSchema({
  resolvers: [getResolvers(loaders)],
  typeDefs: [typeDefinitions],
});

const yoga = createYoga({ schema: executableSchema });
app.use("/graphql", yoga);

const server = app.listen(PORT, () => {
  const addr = server.address();
  console.log(`Listening on port ${PORT}`, JSON.stringify(addr));
});
