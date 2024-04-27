import mongoose from 'mongoose';

const collectionName = 'tickets';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

const TicketModel = mongoose.model(collectionName, ticketSchema);

export default TicketModel;