const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

let books = {
  1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: {} },
  2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: {} },
  3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
  4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: {} },
  5: { author: "Unknown", title: "The Book Of Job", reviews: {} },
  6: { author: "Unknown", title: "One Thousand and One Nights", reviews: {} },
  7: { author: "Unknown", title: "Nj\u00e1l's Saga", reviews: {} },
  8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
  9: {
    author: "Honor\u00e9 de Balzac",
    title: "Le P\u00e8re Goriot",
    reviews: {},
  },
  10: {
    author: "Samuel Beckett",
    title: "Molloy, Malone Dies, The Unnamable, the trilogy",
    reviews: {},
  },
};

async function fetchBooksData() {
  try {
    const response = books;
    if (!response) {
      throw new Error("Data not found!");
    }
    return response;
  } catch (error) {
    console.error("Error while fetching books data:", error);
    throw error;
  }
}

async function fetchBookByIsbn(isbn) {
  try {
    const book = books[isbn];
    if (!book) {
      throw new Error(`Book with ISBN ${isbn} not found`);
    }
    return book;
  } catch (error) {
    console.error(`Error while fetching book with ISBN ${isbn}:`, error);
    throw error;
  }
}

async function fetchBookByAuthor(author) {
  try {
    let resp = [];
    for (const isbn in books) {
      if (books[isbn].author === author) {
        resp.push(books[isbn]);
      }
    }
    return resp;
  } catch (error) {
    console.error(`Error while fetching book with author ${author}:`, error);
    throw error;
  }
}

async function fetchBookByTitle(title) {
      try {
        let resp = [];
        for (const isbn in books) {
          if (books[isbn].title === title) {
            resp.push(books[isbn]);
          }
        }
        return resp;
      } catch (error) {
        console.error(`Error while fetching book with title ${title}:`, error);
        throw error;
      }
    }

    async function fetchBookReview(isbn) {
      try {
        let resp = [];
        for (const bookIsbn in books) {
          if (bookIsbn === isbn && bookIsbn.reviews) {
            resp.push(books[bookIsbn]);
          }
        }
        if (resp.length === 0) {
            return {};
          }
        return resp;
      } catch (error) {
        console.error(`Error while fetching book review`, error);
        throw error;
      }
    }

      async function addBookReview(req) {
      try {
        const { isbn } = req.params;
        const { review } = req.query;
        const username = req.session.authorization.username;
    
        // Check if the book exists
        if (!books[isbn]) {
          return { error: "Book not found" };
        }
    
        // Check if the user has already reviewed this book
        if (books[isbn].reviews[username]) {
          // Modify existing review
          books[isbn].reviews[username] = review;
        } else {
          // Add a new review
          books[isbn].reviews[username] = review;
        }    
        return { message: `The review for the book with ISBN ${isbn} has been added/updated`};
      } catch (error) {
        throw error;
      }
}

 async function deleteBookReview (req) {
      try {
        const { isbn } = req.params;
        const username = req.session.authorization.username;
        // Check if the book exists
        if (!books[isbn]) {
          return { error: "Book not found" };
        }
    
        // Check if the user has reviewed this book
        if (!books[isbn].reviews) {
          return { error: "Review not found" };
        }
    
        // Delete the user's review
        delete books[isbn].reviews[username];
    
        return { message: `Review for the ISBN ${isbn} posted by the user ${username} deleted` };
      } catch (error) {
        throw error;
      }
    }
    
    

module.exports = {
  fetchBooksData,
  fetchBookByIsbn,
  fetchBookByAuthor,
  fetchBookByTitle,
  fetchBookReview,
  addBookReview,
  deleteBookReview,
  books,
};
