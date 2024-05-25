import pg from "pg";

import "dotenv/config";

const { Pool } = pg;
// const { Pool } = (await import(process.env.NODE_ENV !== "test" ? "pg" : "../test/helpers/fakePg")).default;

const OPTIONS = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const poolClient = new Pool(OPTIONS);

async function getBooks() {
  const client = await poolClient.connect();
  const result = await client.query("SELECT title FROM books WHERE isbn= $1", [9781593279509]);
  client.release();
  return result.rows;
}
getBooks();
