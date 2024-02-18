const mongoose = require('mongoose');

const colectionName = 'carts'

const cartsSchema = new mongoose.Schema({
    carts: [
        
    ]
});

const cartsModel = mongoose.model(colectionName, cartsSchema);

module.exports = cartsModel;