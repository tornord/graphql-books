import DataLoader from "dataloader";
import { getAuthors, getBooks, getBooksByAuthorIds } from "./pgClient";
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

export interface Book {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
}

export interface Author {
  id: string;
  name: string;
}

export type Books = Book[];
export type Authors = Author[];

export function createJsonDataLoaders() {
  return {
    //  Book loaders
    books: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.booksById[id as string])) as Promise<Book[]>;
    }),
    allBooks: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => [dataset.books]) as Promise<Books[]>;
    }),

    // Author loaders
    authors: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.authorsById[id as string])) as Promise<Author[]>;
    }),
    allAuthors: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => [dataset.authors]) as Promise<Authors[]>;
    }),
    authorBooks: new DataLoader((ids: readonly string[]) => {
      return delay(DELAY_MS, () => ids.map((id) => dataset.books.filter((d) => d.authorId === id))) as Promise<Books[]>;
    }),
  };
}

export function createPostgresLoaders() {
  const options = { cache: false, batch: true };
  return {
    //  Book loaders
    books: new DataLoader((ids) => getBooks(ids as string[]), options),
    allBooks: new DataLoader((_ids) => {
      return new Promise((resolve) => {
        getBooks(null).then((r) => resolve([r]));
      }) as Promise<Books[]>;
    }, options),

    // Author loaders
    authors: new DataLoader((ids) => getAuthors(ids as string[])),
    // authors: new DataLoader(getAuthors), (should be possible)

    allAuthors: new DataLoader((_ids) => {
      return new Promise((resolve) => {
        getAuthors(null).then((r: Authors) => resolve([r]));
      }) as Promise<Authors[]>;
    }, options),
    authorBooks: new DataLoader((ids) => getBooksByAuthorIds(ids as string[]), options),
  };
}

export function getResolvers(loaders: { [name: string]: DataLoader<string, any> }) {
  const resolvers = {
    Query: {
      // hello: () => "Hello World!",
      // rollDice: (_root: unknown, { numDice, numSides = 6 }: { numDice: number; numSides: number }) => {
      //   const output: number[] = [];
      //   for (var i = 0; i < numDice; i++) {
      //     output.push(1 + Math.floor(Math.random() * numSides));
      //   }
      //   return output;
      // },
      books: () => loaders.allBooks.load("all"),
      bookById: (_root: unknown, { id }: { id: string }) => loaders.books.load(id),
      authors: () => loaders.allAuthors.load("all"),
    },
    Book: {
      author: (root: Book) => loaders.authors.load(root.authorId),
    },
    Author: {
      books: (root: Author) => loaders.authorBooks.load(root.id),
    },
  };
  return resolvers;
}
