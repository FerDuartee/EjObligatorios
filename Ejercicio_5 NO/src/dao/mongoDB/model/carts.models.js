const mongoose = require('mongoose');

const colectionName = 'carts'

const cartsSchema = mongoose.Schema({
    carts: [
        
    ]
});

const cartsModel = mongoose.model(colectionName, cartsSchema);

module.exports = cartsModel;