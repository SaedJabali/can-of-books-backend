'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: String,
  description: String,
  status: String,
});

const userSchema = new Schema({
  email: String,
  books: [bookSchema],
});

// make model from schema
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
