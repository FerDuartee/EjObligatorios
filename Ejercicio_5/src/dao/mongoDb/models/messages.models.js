const mongoose = require('mongoose');

const colectionName = 'messages'

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
  });

const messagesModel = mongoose.model(colectionName, messageSchema);

module.exports = messagesModel;