const express = require('express');
const public_users = express.Router();
let { fetchBooksData, fetchBookByIsbn, fetchBookByAuthor, fetchBookByTitle} = require('./bookdb.js');


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',
  async function (req, res) {
    try {
      const booksData = await fetchBooksData(); 
      res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
      res.status(500).send('Error fetching books data');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await fetchBookByIsbn(isbn);
    res.send(book);
  } catch (error) {
    res.status(404).send('Book not found');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  try {
    const book = await fetchBookByAuthor(author);
    res.send({
      "booksByAuthor": book
    });
  } catch (error) {
    res.status(404).send('Book not found');
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  try {
    const book = await fetchBookByTitle(title);
    res.send({
      "booksByTitle": book
    });
  } catch (error) {
    res.status(404).send('Book not found');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
