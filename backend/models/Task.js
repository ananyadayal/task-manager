const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],//status has to be any one of these only
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,// MongoDB automatically generates unique IDs which are called ObjectId
    ref: 'User',// reference like foreign key in DBMS
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);