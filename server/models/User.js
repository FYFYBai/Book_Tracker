const mongoose = require('mongoose');

// User Schema for the mongoose collection storage
const UserSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  savedBooks: [{
    bookId: String,
    title: String,
    authors: [String],
    description: String,
    image: String,
    link: String
  }]
});

module.exports = mongoose.model('User', UserSchema);