const express = require('express');
const router = express.Router();
const { createUser, getUsers, syncUser } = require('../controllers/UserController');

// Create new user
router.post('/users', createUser);

// Get all users (for testing)
router.get('/users', getUsers);

// Ensure the logged in user is added to the database
router.post('/sync-user', syncUser);

module.exports = router;