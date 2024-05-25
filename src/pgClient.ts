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

export async function getBooks(ids: null | string[] = null) {
  console.log("getBooks", ids?.join(", "), Date.now());
  const client = await poolClient.connect();
  let result;
  if (!ids) {
    result = await client.query("SELECT * FROM books");
  } else {
    result = await client.query("SELECT * FROM books WHERE id = ANY ($1)", [ids]);
  }
  client.release();
  for (const r of result.rows) {
    r.id = String(r.id);
    r.authorId = String(r.author_id);
    delete r.author_id;
  }
  return result.rows;
}

export async function getBooksByAuthorId(authorIds: string[]) {
  console.log("getBooksByAuthorId", authorIds?.join(", "), Date.now());
  const client = await poolClient.connect();
  const result = await client.query("SELECT * FROM books WHERE author_id = ANY ($1)", [authorIds]);
  const resDict: { [id: string]: any } = {};
  client.release();
  for (const r of result.rows) {
    r.id = String(r.id);
    r.authorId = String(r.author_id);
    delete r.author_id;
    if (!resDict[r.authorId]) {
      resDict[r.authorId] = [];
    }
    resDict[r.authorId].push(r);
  }
  return authorIds.map((id) => resDict[id] ?? []);
}

export async function getAuthors(ids: null | string[] = null) {
  console.log("getAuthors", ids?.join(", "), Date.now());
  const client = await poolClient.connect();
  let result;
  if (!ids) {
    result = await client.query("SELECT * FROM authors");
  } else {
    result = await client.query("SELECT * FROM authors WHERE id = ANY ($1)", [ids]);
  }
  client.release();
  for (const r of result.rows) {
    r.id = String(r.id);
  }
  return result.rows;
}

// const res = await getBooksByAuthorId("1");
// console.log(res);
