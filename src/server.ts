import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createYoga } from "graphql-yoga";
import { createJsonDataLoaders, createPostgresLoaders, getResolvers } from "./resolvers";
import { typeDefinitions } from "./schema";
import { graphql, GraphQLArgs } from "graphql";

const app = express();
const PORT = 3000;

const loaders = createJsonDataLoaders(); // createPostgresLoaders();
const executableSchema = makeExecutableSchema({
  resolvers: [getResolvers(loaders)],
  typeDefs: [typeDefinitions],
});

const x = await graphql({ schema: executableSchema, source: "{ bookById(id: \"1\") { id title author { name } } }" });
console.log(JSON.stringify(x.data));
console.log((x.data as any).bookById.author.name);

const yoga = createYoga({ schema: executableSchema });
app.use("/graphql", yoga);

const server = app.listen(PORT, () => {
  const addr = server.address();
  console.log(`Listening on port ${PORT}`, JSON.stringify(addr));
});
