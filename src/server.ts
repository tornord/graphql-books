import { resolve } from "node:path";

import express, { NextFunction, Request, Response } from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createSchema, createYoga } from "graphql-yoga";
import { dataset } from "./books";
import { getResolvers } from "./resolvers";
import { typeDefinitions } from "./schema";

const app = express();
const PORT = 3000;

const executableSchema = makeExecutableSchema({
  resolvers: [getResolvers(dataset)],
  typeDefs: [typeDefinitions],
});

const yoga = createYoga({ schema: executableSchema });
app.use("/graphql", yoga);

const server = app.listen(PORT, () => {
  const addr = server.address();
  console.log(`Listening on port ${PORT}`, JSON.stringify(addr));
});
