import DataLoader from "dataloader";
import { getAuthors, getBooks, getBooksByAuthorId } from "./pgClient";
import { dataset } from "./books";

export interface Dataset {
  books: any[];
  authors: any[];
}

function delay(ms: number, callback: () => unknown) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(callback());
    }, ms)
  );
}
// delay(1000, () => [1, 2, 3]).then((r) => console.log(r));

const DELAY_MS = 25;

export function createJsonDataLoaders() {
  return {
    books: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.booksById[id as string])) as Promise<unknown[]>;
    }),
    allBooks: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => [dataset.books]) as Promise<unknown[]>;
    }),
    authors: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.authorsById[id as string])) as Promise<unknown[]>;
    }),
    allAuthors: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => [dataset.authors]) as Promise<unknown[]>;
    }),
    authorBooks: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.books.filter((d) => d.authorId === id))) as Promise<
        unknown[]
      >;
    }),
  };
}

export function createPostgresLoaders() {
  return {
    books: new DataLoader((ids) => getBooks(ids as string[])),
    allBooks: new DataLoader((ids) => {
      return new Promise((resolve) => {
        getBooks(null).then((r) => resolve([r]));
      }) as Promise<unknown[]>;
    }),
    authors: new DataLoader((ids) => getAuthors(ids as string[])),
    allAuthors: new DataLoader((ids) => {
      return new Promise((resolve) => {
        getAuthors(null).then((r: unknown) => resolve([r]));
      }) as Promise<unknown[]>;
    }),
    authorBooks: new DataLoader((ids) => getBooksByAuthorId(ids as string[])),
  };
}

export function getResolvers(loaders: { [name: string]: DataLoader<string, any> }) {
  const resolvers = {
    Query: {
      hello: () => "Hello World!",
      rollDice: (_root: unknown, { numDice, numSides = 6 }: { numDice: number; numSides: number }) => {
        const output: number[] = [];
        for (var i = 0; i < numDice; i++) {
          output.push(1 + Math.floor(Math.random() * numSides));
        }
        return output;
      },
      books: () => loaders.allBooks.load("all"),
      bookById: (_root: unknown, { id }: { id: string }) => loaders.books.load(id),
      authors: () => loaders.allAuthors.load("all"),
    },
    Book: {
      author: (root: any /*Book*/) => loaders.authors.load(root.authorId),
    },
    Author: {
      books: (root: any /*Author*/) => loaders.authorBooks.load(root.id),
    },
  };
  return resolvers;
}
