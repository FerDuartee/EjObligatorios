import mongoose from 'mongoose';

export const collectionName = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  }
});

const ticketModel = mongoose.model(collectionName, ticketSchema);

export default ticketModel;