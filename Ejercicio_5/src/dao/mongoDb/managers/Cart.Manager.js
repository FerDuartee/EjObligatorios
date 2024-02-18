const cartsModel = require("../models/carts.models");

class CartManagerMongo {
    getCartById = async (id) => {
        try {
          const cart = await cartsModel.findById(id);
          return cart;
        } catch (error) {
          console.log("Error while getting cart by ID:", error);
          throw error;
        }
      };

      createCart = async (bodyCart) => {
        try {
          const newCart = await cartsModel.create(bodyCart);
          return newCart;
        } catch (error) {
          console.log("Error while creating product:", error);
          throw error;
        }
      };
}

module.exports = CartManagerMongo;