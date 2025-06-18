const express = require('express');
const router = express.Router();
const { createUser, getUsers, syncUser, updateUserBooks } = require('../controllers/UserController');

// Routes for the api to call to interact with the server

// Create new user
router.post('/users', createUser);

// Get all users (for testing)
router.get('/users', getUsers);

// Ensure the logged in user is added to the database
router.post('/users/sync-user', syncUser);

// Add or remove book from user's savedBooks
router.put('/users/books', updateUserBooks);


module.exports = router;