const express = require('express');
const CartManagerMongo = require('../dao/mongoDb/managers/Cart.Manager');
const cartsModel = require('../dao/mongoDb/models/carts.models');

const router = express.Router();
const cartManager = new CartManagerMongo();

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
      const cart = await cartsModel.findById(cid).populate('products');
      res.json(cart);
  } catch (error) {
      console.error('Error while fetching cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
      const cart = await cartManager.removeAllProductsFromCart(cid);
      res.json(cart);
  } catch (error) {
      console.error('Error while removing all products from cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const bodyCart = req.body;
  try {
    const newCart = await cartManager.createCart(bodyCart);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error while creating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
      // Llamar al método para agregar el producto al carrito
      const cart = await cartManager.addProductToCart(cid, pid);
      res.json(cart);
  } catch (error) {
      console.error('Error while adding product to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
      const cart = await cartManager.removeProductFromCart(cid, pid);
      res.json(cart);
  } catch (error) {
      console.error('Error while removing product from cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
      const cart = await cartManager.updateCart(cid, products);
      res.json(cart);
  } catch (error) {
      console.error('Error while updating cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Actualizar la cantidad de ejemplares del producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
      const cart = await cartManager.updateProductQuantityInCart(cid, pid, quantity);
      res.json(cart);
  } catch (error) {
      console.error('Error while updating product quantity in cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

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

module.exports = router;