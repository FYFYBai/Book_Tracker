const User = require('../models/User');

// Create User (only for postman testing, not integrated)
exports.createUser = async (req, res) => {
  try {
    const { auth0Id, email, username } = req.body;
    
    // Simple validation
    if (!username.trim() || !email.trim() || !auth0Id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (username.trim().length() < 5 || username.trim().length() > 20) {
      return res.status(400).json({ error: 'Username must be between 5 and 20 characters.' });
    }

    if (email.trim().length() < 4 || !email.includes("@") || email.trim().length() > 60) {
      return res.status(400).json({ error: 'Email must contain an @' });
    }

    // create the user
    const newUser = new User({
      auth0Id,
      email,
      name: username,
      savedBooks: []
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a user with the info of the currently authorized user (authorized through Auth0)
// Not validating data synce Auth0 sanitizes the fields
exports.syncUser = async (req, res) => {
  try {
    const { auth0Id, email, name } = req.body;

    // First check if user exists
    let user = await User.findOne({ auth0Id });
    console.log("user: " + user);

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        auth0Id,
        email,
        name: name || email.split('@')[0],
        savedBooks: []
      });
      await user.save();
      return res.status(201).json(user);
    }

    // Return existing user
    res.status(200).json(user);
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ 
      error: 'Failed to sync user',
      details: err.message 
    });
  }
};