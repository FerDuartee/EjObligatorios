import mongoose from 'mongoose';

const collectionName = 'carts';

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
          ref: "products",
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