import DataLoader from "dataloader";
import { getBooks } from "./pgClient";

// DataLoaderFunction (keys: string[]) => Promise<Book[]>)
// eller
// DataLoaderFunction async (keys: string) => Book[])
function bookBatch(keys: any) {
  const results = getBooks(keys);
  return results;
}

async function main() {
  const bookLoader = new DataLoader(bookBatch, {
    cache: false,
    batch: true,
  });
  
  const r1 = bookLoader.load("1");
  const r2 = await bookLoader.load("2");
  const r3 = await bookLoader.load("3");
  const r4 = await bookLoader.loadMany(["1", "2"]);

  console.log(await bookLoader.load("1"));
}

await main();
