import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { collectionName as CollectionCart } from './carts.models.js';

export const collectionName = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CollectionCart,
  },
  role: {
    type: String,
    default: 'user' // Establece el valor predeterminado como 'user'
  }
});

userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(collectionName, userSchema);

export default userModel;