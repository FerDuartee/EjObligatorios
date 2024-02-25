const express = require('express');
const CartManagerMongo = require('../dao/mongoDb/managers/Cart.Manager');

const router = express.Router();
const cartManager = new CartManagerMongo();

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error while fetching cart by ID:', error);
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

router.post('/:cid/product/:pid', async (req, res) => {
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

module.exports = router;