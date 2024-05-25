export const typeDefinitions = `
  type Book {
    id: String
    authorId: String
    isbn: String
    title: String
    subtitle: String
    published: String
    publisher: String
    pages: String
    description: String
    website: String
    author: Author
  }

  type Author {
    id: String
    name: String
    books: [Book]
  }

  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
    hello: String
    books: [Book]
    bookById(id: String): Book
    authors: [Author]
  }
`;
