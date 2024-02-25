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
      addProductToCart = async (cartId, productId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart.products[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                cart.products.push({ product: productId });
            }

            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("Error while adding product to cart:", error);
            throw error;
        }
    };
}

module.exports = CartManagerMongo;