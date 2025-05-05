const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

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

// Fetch books using Promises
function getBooks(req, res) {
    // Return a Promise that resolves with the books data after some time
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books); // Resolve the Promise with books data after 1 second
        }, 1000); // Simulating 1 second delay
    })
    .then((booksData) => {
        res.send(booksData); // Send the books data as the response
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error fetching books" }); // Handle any errors
    });
}

// Get the book list available in the shop
public_users.get('/', getBooks);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function getBookDetailsByISBN(req, res) {
    const isbn = req.params.isbn;  // Get ISBN from the route parameter

    // Return a Promise that will resolve with the book details
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];  // Find the book with the given ISBN
            if (book) {
                resolve(book);  // If book is found, resolve with the book details
            } else {
                reject("Book not found");  // If no book is found, reject with an error message
            }
        }, 1000);  // Simulate a 1 second delay
    })
    .then((bookDetails) => {
        res.send(bookDetails);  // Send the book details as the response
    })
    .catch((error) => {
        console.error(error);
        res.status(404).json({ message: error });  // Send a 404 error if book is not found
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLocaleLowerCase();

    // Return a Promise to simulate async behavior
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book =>
                book.author.toLowerCase().includes(author)
            );

            if (matchingBooks.length) {
                resolve(matchingBooks); // Resolve the Promise if books are found
            } else {
                reject("No books found by that author"); // Reject the Promise if no books are found
            }
        }, 1000); // Simulating a delay of 1 second
    })
    .then((matchingBooks) => {
        res.json(matchingBooks); // Send the list of books if found
    })
    .catch((error) => {
        console.error(error);
        res.status(404).json({ error: error }); // Return a 404 error if no books are found
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title;

    // Return a Promise to simulate async behavior
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book =>
                book.title.toLowerCase().includes(titleParam.toLowerCase())
            );

            if (matchingBooks.length) {
                resolve(matchingBooks); // Resolve the Promise if books are found
            } else {
                reject("No books found with that title"); // Reject the Promise if no books are found
            }
        }, 1000); // Simulating a delay of 1 second
    })
    .then((matchingBooks) => {
        res.json(matchingBooks); // Send the list of books if found
    })
    .catch((error) => {
        console.error(error);
        res.status(404).json({ error: error }); // Return a 404 error if no books are found
    });
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
