const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let { books, fetchBookByIsbn, fetchBookByAuthor, fetchBookByTitle, fetchBookReview, addBookReview, deleteBookReview } = require('./bookdb.js');


let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Filter the users array for any user with the same username
let userswithsamename = users.filter((user) => {
  return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Filter the users array for any user with the same username and password
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password);
});
// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Register a new user
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// get all books
regd_users.get('/', 
   function (req, res) {
  try {
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).send('Error fetching books data');
  }
});

// Get books by isbn
regd_users.get('/isbn/:isbn', 
  async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await fetchBookByIsbn(isbn);
    res.send(book);
  } catch (error) {
    res.status(404).send('Book not found');
  }
});

// Get books by author
regd_users.get('/author/:author',
  async function (req, res) {
    const author = req.params.author;
    try {
      const book = await fetchBookByAuthor(author);
      res.send({
        "booksByAuthor": book
      });
    } catch (error) {
      res.status(404).send('Book not found');
    }
})

// Get books by title
regd_users.get('/title/:title',
  async function (req, res) {
    const title = req.params.title;
    try {
      const book = await fetchBookByTitle(title);
      res.send({
        "booksByTitle": book
      });
    } catch (error) {
      res.status(404).send('Book not found');
    }
})

// Get books review
regd_users.get('/review/:isbn',
  async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const book = await fetchBookReview(isbn);
      res.send(book);
    } catch (error) {
      res.status(404).send('Book not found');
    }
})

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const resp = await addBookReview(req); 
    if(resp.message){
      return res.status(200).json(resp.message);  
    } else{
      throw "Unable to add/update review!"
    }
  } catch (error) {
    console.error("Error while adding/modifying review", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  try {
    const resp = await deleteBookReview(req); 
    if(resp.message){
      return res.status(200).json(resp.message);  
    } else{
      throw "Unable to delete review!"
    }
  } catch (error) {
    console.error("Error while deleting review !!", error);
        return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
