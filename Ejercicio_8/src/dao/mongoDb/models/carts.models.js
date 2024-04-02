const mongoose = require('mongoose');

const collectionName = 'carts'

const cartSchema = new mongoose.Schema({
  products: [{
      product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
      },
      quantity: {
          type: Number,
          default: 1 // Por defecto, la cantidad será 1 al agregar un producto al carrito
      }
  }]
});

cartSchema.pre("find", function () {
  this.populate("products.product");
});

const cartsModel = mongoose.model(collectionName, cartSchema);

module.exports = cartsModel;