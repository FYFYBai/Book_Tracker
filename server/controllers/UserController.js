const User = require('../models/User');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { username, email, auth0Id } = req.body;
    
    // Simple validation
    if (!username || !email || !auth0Id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrCreateUser = async (req, res) => {
  try {
    const { auth0Id, email, name } = req.body;
    
    let user = await User.findOne({ auth0Id });
    
    if (!user) {
      user = new User({
        auth0Id,
        email,
        name,
        savedBooks: []
      });
      await user.save();
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserBooks = async (req, res) => {
  try {
    const { auth0Id, bookData, action } = req.body;
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (action === 'save') {
      const bookExists = user.savedBooks.some(book => book.bookId === bookData.bookId);
      if (!bookExists) {
        user.savedBooks.push(bookData);
      }
    } else if (action === 'unsave') {
      user.savedBooks = user.savedBooks.filter(book => book.bookId !== bookData.bookId);
    }
    
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};