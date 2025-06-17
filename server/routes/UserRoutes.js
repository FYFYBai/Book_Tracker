const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/userController');

// Create new user
router.post('/users', createUser);

// Get all users (for testing)
router.get('/users', getUsers);

module.exports = router;