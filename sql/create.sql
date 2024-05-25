-- Create authors table
CREATE TABLE authors (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create books table
CREATE TABLE books (
    id INT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    author_id INT,
    published DATE,
    publisher VARCHAR(255),
    pages INT,
    description TEXT,
    website VARCHAR(255),
    FOREIGN KEY (author_id) REFERENCES authors(id)
);