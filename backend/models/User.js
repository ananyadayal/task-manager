//importing lib
const mongoose = require('mongoose');

//creating schema 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, 

{ timestamps: true });//automatically adds the created and  updated at timpestamps

//makes this file available to export in other files
module.exports = mongoose.model('User', userSchema);