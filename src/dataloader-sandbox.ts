import DataLoader from "dataloader";
import { getBooks } from "./pgClient";

function bookBatch(keys: any) {
  console.log("bookBatch", keys, Date.now());
  const results = getBooks(keys);
  return results;
}

async function main() {
  const bookLoader = new DataLoader(bookBatch, {
    cache: true,
    batch: true,
  });

  bookLoader.load("1");
  const r2 = await bookLoader.load("2");
  const r3 = await bookLoader.load("3");
  const r4 = await bookLoader.loadMany(["1", "2"]);

  console.log(await bookLoader.load("1"));
}

await main();
