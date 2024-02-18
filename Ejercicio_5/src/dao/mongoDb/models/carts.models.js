const mongoose = require('mongoose');

const collectionName = 'carts'

const productSchema = new mongoose.Schema({
    product: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    products: [productSchema]
});

const cartsDataSchema = new mongoose.Schema({
    carts: [cartSchema]
});

const cartsModel = mongoose.model(collectionName, cartsDataSchema);

module.exports = cartsModel;