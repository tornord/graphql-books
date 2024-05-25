export interface Dataset {
  books: any[];
  authors: any[];
}

export function getResolvers(dataset: Dataset) {
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
      books: () => {
        // const books = await postgres("select * from books");
        return dataset.books;
      },
      bookById: (_root: unknown, { id }: { id: string }) => {
        return dataset.books.find((book) => book.id === id);
      },
      authors: () => dataset.authors,
    },
    Book: {
      author: (root: any /*Book*/) => {
        return dataset.authors.find((author) => author.id === root.authorId) ?? null;
      },
    },
    Author: {
      books: (root: any /*Author*/) => {
        return dataset.books.filter((book) => book.authorId === root.id); // as Book[];
      },
    },
  };
  return resolvers;
}
