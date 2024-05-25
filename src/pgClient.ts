import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const OPTIONS = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true,
};

const poolClient = new Pool(OPTIONS);

export async function getBooks(ids: string[]) {
  const client = await poolClient.connect();
  const result = await client.query("SELECT title FROM books WHERE id = ANY ($1)", [ids]);
  client.release();
  return result.rows;
}

// const res = await getBooks(["1", "2", "3"]);
// console.log(res);
