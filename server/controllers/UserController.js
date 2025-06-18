const User = require('../models/User');

// Create User (only for postman testing, not integrated)
exports.createUser = async (req, res) => {
  try {
    const { auth0Id, email } = req.body;

    if (email.trim().length() < 4 || !email.includes("@") || email.trim().length() > 60) {
      return res.status(400).json({ error: 'Email must contain an @' });
    }

    // create the user
    const newUser = new User({
      auth0Id,
      email,
      name: email.split('@')[0],
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
    const { auth0Id, email } = req.body;

    // First check if user exists
    let user = await User.findOne({ auth0Id });
    console.log("user: " + user);

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        auth0Id,
        email,
        name: email.split('@')[0],
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

// Add or remove book from user's savedBooks
exports.updateUserBooks = async (req, res) => {
  const { auth0Id, bookData, action } = req.body;

  try {
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadySaved = user.savedBooks.some(book => book.bookId === bookData.bookId);

    if (action === 'add' && !alreadySaved) {
      user.savedBooks.push(bookData);
    } else if (action === 'remove') {
      user.savedBooks = user.savedBooks.filter(book => book.bookId !== bookData.bookId);
    }

    await user.save();
    res.status(200).json(user.savedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
