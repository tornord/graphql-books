import { resolve } from "node:path";

import express, { NextFunction, Request, Response } from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createSchema, createYoga } from "graphql-yoga";
import { dataset } from "./books";
import { getResolvers } from "./resolvers";
import { typeDefinitions } from "./schema";

import { Pool } from 'pg';

const app = express();
const PORT = 3000;

//graphql 
// import dotenv from 'dotenv';
// import { Pool } from 'pg';

// // Load environment variables from .env file
// dotenv.config();

// Create a PostgreSQL connection pool
const poolClient = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  schema: process.env.DB_SCHEMA,
});

// poolClient.

// // Example query
// pool.query('SELECT * FROM ' + process.env.DB_SCHEMA + '.my_table', (err, res) => {
//   if (err) {
//     console.error('Error executing query', err);
//     return;
//   }
//   console.log('Query result:', res.rows);
//   pool.end(); // Don't forget to end the pool when done
// });
// In this example, 




const executableSchema = makeExecutableSchema({
  resolvers: [getResolvers(dataset)],
  typeDefs: [typeDefinitions],
});

const yoga = createYoga({
  schema: executableSchema,
});
app.use("/graphql", yoga);

const server = app.listen(PORT, () => {
  const addr = server.address();
  console.log(`Listening on port ${PORT}`, JSON.stringify(addr));
});
