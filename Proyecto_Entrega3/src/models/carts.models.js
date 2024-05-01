import mongoose from 'mongoose';
import { collectionName as collectionProducts } from './products.model.js'

export const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    unique: true,
    required: true
  },
  products: [{
      product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: collectionProducts,
      },
      quantity: {
          type: Number,
          default: 1
      }
  }]
});


cartSchema.pre("find", function () {
  this.populate("products.product");
});

const cartsModel = mongoose.model(collectionName, cartSchema);

export default cartsModel;