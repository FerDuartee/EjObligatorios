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
  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Filtrar los productos para eliminar el producto con el productId
      cart.products = cart.products.filter(item => !item.product.equals(productId));

      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error while removing product from cart:", error);
      throw error;
    }
  };

  // Actualizar el carrito con un arreglo de productos
  updateCart = async (cartId, products) => {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Reemplazar los productos del carrito con los nuevos productos proporcionados
      cart.products = products;

      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error while updating cart:", error);
      throw error;
    }
  };

  // Actualizar la cantidad de ejemplares del producto en el carrito
  updateProductQuantityInCart = async (cartId, productId, quantity) => {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Encontrar el producto en el carrito y actualizar su cantidad
      const product = cart.products.find(item => item.product.equals(productId));
      if (product) {
        product.quantity = quantity;
      }

      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error while updating product quantity in cart:", error);
      throw error;
    }
  };
  removeAllProductsFromCart = async (cartId) => {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Limpiar el array de productos del carrito
      cart.products = [];

      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error while removing all products from cart:", error);
      throw error;
    }
  };
}

module.exports = CartManagerMongo;