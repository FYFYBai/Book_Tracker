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

exports.syncUser = async (req, res) => {
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