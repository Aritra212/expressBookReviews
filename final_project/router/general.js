const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
  
    // Check if username already exists
    if (users[username]) {
      return res.status(409).json({ error: "Username already exists" });
    }
  
    // Save new user
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn.toLocaleLowerCase();
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLocaleLowerCase();
  
    const matchingBooks = Object.values(books).filter(book =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  
    return matchingBooks.length
      ? res.json(matchingBooks)
      : res.status(404).json({ error: 'No books found by that author' });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const titleParam = req.params.title;

    const matchingBooks = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(titleParam.toLowerCase())
    );
  
    return matchingBooks.length
      ? res.json(matchingBooks)
      : res.status(404).json({ error: 'No books found with that title' });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    return res.json({ title:book.title, reviews: book.reviews });
});

module.exports.general = public_users;
