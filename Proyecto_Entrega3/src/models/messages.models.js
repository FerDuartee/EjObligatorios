import mongoose from 'mongoose';

const collectionName = 'messages';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
  });

const messagesModel = mongoose.model(collectionName, messageSchema);

export default messagesModel;