const mongoose = require('mongoose');

const collectionName = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
            },
          },
        ],
        default: [],
      },
});

cartSchema.pre("find", function () {
    this.populate("products.product");
  });

const cartsModel = mongoose.model(collectionName, cartSchema);

module.exports = cartsModel;